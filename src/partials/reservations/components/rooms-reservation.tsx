import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import OrdersClient from "@/api/services/OrdersClient";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"
import ComponentLoader from "@/components/common/component-loader";
import useGetOrder from "../hooks/useGetOrder";
import useOrder from "../hooks/useOrder.tsx";
import useInitOrder from "../providers/useOrder.tsx";
import { InfoPassengerModal } from "./info-passenger";
import ModalRules from "./modal-rules";
import { PassengerModal } from "./passenger-modal";
import { PassportPassengerModal } from "./passport-passenger";
import RoomSelector from './rooms';


interface TabInterface {
    formEdit: boolean;
    setFormEdit: Dispatch<SetStateAction<boolean>>;
}

export default function RoomsReservation({ formEdit, setFormEdit }: TabInterface) {
    const ordersClient = new OrdersClient();

    const [loading, setLoading] = useState(false);
    const addRomFunctionRef = useRef<{ addRoom: () => void }>(null);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const { initOrder } = useInitOrder();
    const { getPassenger } = useGetOrder();
    const {
        rulesBloqueo,
        roomsInformation,
        selectedBloqueo,
        uuid,
        order,
        model,
        editPermissions
    } = useOrder();
    const [openModalRules, setOpenModalRules] = useState<boolean>(false);
    const [openModalPassenger, setOpenModalPassenger] = useState<boolean>(false);
    const [modalPassport, setModalPassport] = useState<boolean>(false);
    const [modalPsgInfo, setModalPsgInfo] = useState<boolean>(false);
    const [infoPassenger, setInfoPassenger] = useState<PassengerInterface>();

    async function handleSubmit() {
        if (!uuid) return;
        setLoadingOrder(true);
        try {
            const data = await ordersClient.orderReservationQuote(uuid, { rooms: roomsInformation });
            if (data && data.uid) {
                const url = window.location.href.split('/reservaciones')[0];
                window.location.href = url + `/cotizaciones/${data.uid}`;
                toast.success('La información se actualizo correctamente')
            }
        } catch (e) {
            toast.error(String(e));
            console.error(e)
        } finally {
            setLoadingOrder(false);
        }
    }

    async function openModalPsg(info: PassengerInterface) {
        if (info.main) return toast.success('La información se actualizo correctamente');
        if (!editPermissions) return toast.error('¡Usted ya no puede cambiar el pasajero principal!')
        if (
            info.first_name !== "" && info.first_name !== "Pasajero" &&
            info.first_last_name !== "" && info.email !== "" &&
            uuid && info.phone && /^\d+$/.test(info.phone) &&
            info.uid
        ) {
            setLoadingOrder(true);
            try {
                const data = await ordersClient.orderReservationPsgMain(uuid, info.uid,
                    {
                        main: true,
                        title_pax: info.title,
                        first_name: info.first_name,
                        middle_name: info.middle_name,
                        first_last_name: info.first_last_name,
                        second_last_name: info.second_last_name,
                        email: info.email,
                        phone: info.phone
                    }
                );
                if (data) {
                    initOrder();
                    toast.success('Información actualizada correctamente');
                }
            } catch (e) {
                console.error(e);
                toast.error(String(e));
            } finally {
                setLoadingOrder(false);
            }
        } else {
            setOpenModalPassenger(true);
            const passenger = getPassenger(info.uid);
            setInfoPassenger(passenger)
        }
    }

    async function handleTwin(room: number, twin: boolean) {
        if (!uuid) return;

        setLoadingOrder(true);
        try {
            const data = await ordersClient.orderReservationTwin(uuid, {
                room: room,
                twin: twin ? 0 : 1,
            })

            if (data) {
                initOrder();
                toast.success('La información se actualizo correctamente')
            }
        } catch (e) {
            toast.error(String(e));
            console.error(e)
        } finally {
            setLoadingOrder(false);
        }
    }

    useEffect(() => {
        if (!infoPassenger || formEdit) return;
        const passenger = getPassenger(infoPassenger.uid);
        setInfoPassenger(passenger);
    }, [roomsInformation]);

    return (
        <div className="col-12 p-5 row">
            {loadingOrder && ComponentLoader()}

            <div className="col-12 col-sm-6 fs-4 mt-3 fw-bold">
                Información de pasajeros
            </div>

            {!formEdit && order && model === 'reservation' && editPermissions &&
                <div className="col-12 col-sm-6 d-flex justify-content-end mb-2">
                    <Button onClick={() => setFormEdit(true)} className="btn btn-outline btn-outline-dashed btn-outline-success btn-active-light-success">
                        <i className="fas fa-expand-arrows-alt fs-4 me-2"></i> Modo edición
                    </Button>
                </div>
            }

            {infoPassenger &&
                <>
                    <PassengerModal
                        open={openModalPassenger}
                        onOpenChange={() => setOpenModalPassenger(false)}
                        info={infoPassenger}
                    />

                    <PassportPassengerModal
                        open={modalPassport}
                        onOpenChange={() => setModalPassport(false)}
                        info={infoPassenger}
                    />

                    <InfoPassengerModal
                        open={modalPsgInfo}
                        onOpenChange={() => setModalPsgInfo(false)}
                        info={infoPassenger}
                    />

                    {/* <InfoPassportModal
                        open={passportAuto}
                        onOpenChange={() => setPassportAuto(false)}
                        info={infoPassenger}
                    /> */}
                </>
            }

            {!formEdit && order &&
                order.rooms.map((room, index) => (
                    <div className="col-12 mb-5" key={index + room.code}>
                        <div className="room_header d-flex justify-content-between align-items-center">
                            <div className="number text-start">
                                Habitación <span data-name="room_number">{Number(index) + 1} {room.name} [Terrestre]</span>
                            </div>

                            {room.code === 'dbl' && editPermissions &&
                                <div className="d-flex aling-items-center gap-2">
                                    <Checkbox value={1} onCheckedChange={() => handleTwin(Number(room.room_sequence), room.twin)} variant='warning' checked={room.twin} />
                                    <span className="text-white">Habitación twin</span>
                                </div>
                            }
                        </div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="fw-bold text-center">Tipo</th>
                                    <th></th>
                                    <th className="fw-bold">Nombres</th>
                                    <th className="fw-bold">F. Nacimiento</th>
                                    <th className="fw-bold">Género</th>
                                    <th className="fw-bold">Progreso</th>
                                    <th className="fw-bold !tw-w-[50px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {room.passengers.map((p, index: number) => {
                                    return p.information ? <tr key={p.information.uid} className={index % 2 !== 1 ? 'bg-light-warning' : ''}>
                                        <td className="text-center">
                                            {p.name}
                                        </td>
                                        <td>
                                            <i className="fas fa-bus"></i>
                                        </td>
                                        <td>
                                            {p.information.first_name === 'Pasajero' ? 'Pasajero' :
                                                `${p.information.first_name} ${p.information.first_last_name}`}
                                        </td>
                                        <td>
                                            {moment(p.information.birthday).format('DD-MM-YYYY')}
                                        </td>
                                        <td>
                                            {p.information.gender === 'male' ? 'Masculino' : 'Femenino'}
                                        </td>
                                        <td>
                                            <div className="d-flex tw-items-center">
                                                <span className="p-2 rounded-2 tw-text-sm fw-semibold"
                                                    style={{ background: `hsl(${Number(p.information.progres * 1.2).toFixed(0)},70%,70%)` }}>
                                                    {p.information.progres.toFixed(0)} %
                                                </span>
                                            </div>
                                        </td>
                                        <td className="d-flex gap-2">
                                            <Button onClick={() => openModalPsg(p.information)}
                                                className={p.type !== 'adt' ? 'd-none' : (
                                                    p.information.main ? 'bg-success' : 'btn-warning'
                                                )} >
                                                <i className="fas fa-star p-0"></i>
                                            </Button>
                                            <Button
                                                className="btn-dark"
                                                onClick={() => {
                                                    const passenger = getPassenger(p.information.uid);
                                                    setModalPassport(true)
                                                    setInfoPassenger(passenger);
                                                }}
                                            >
                                                <i className="fas fa-globe p-0"></i>
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const passenger = getPassenger(p.information.uid);
                                                    setModalPsgInfo(true)
                                                    setInfoPassenger(passenger);
                                                }}
                                            >
                                                <i className="fas fa-user-edit p-0"></i>
                                            </Button>
                                            {/* <Button
                                                onClick={() => {
                                                    const passenger = getPassenger(p.information.uid);
                                                    setPassportAuto(true)
                                                    setInfoPassenger(passenger);
                                                }}
                                            >
                                                <i className="bi bi-person-vcard p-0"></i>
                                            </Button> */}
                                        </td>
                                    </tr>
                                        : <></>
                                }
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                ))
            }

            <div className="col-12 mt-5 div-card-room tw-relative tw-min-h-max">
                {loading && (
                    ComponentLoader()
                )}
                {selectedBloqueo && formEdit && !loading ? (
                    <RoomSelector
                        ref={addRomFunctionRef}
                    />
                ) :
                    <></>}
            </div>
            {formEdit &&
                <div>
                    <div className="col-12 ">
                        {rulesBloqueo && (
                            <div className="row">
                                <div className="col-md-12 d-flex justify-content-center align-items-center">
                                    <Button
                                        onClick={() =>
                                            addRomFunctionRef.current?.addRoom()
                                        }
                                        className="btn-light-success me-3"
                                    >
                                        + Agregar habitación
                                    </Button>
                                    <Button className="mb-1" onClick={() => setOpenModalRules(true)}>
                                        <i className="fas fa-info-circle"></i> Reglas de Pasajeros y Habitaciones
                                    </Button>
                                    <ModalRules
                                        open={openModalRules}
                                        onOpenChange={() => {
                                            setOpenModalRules(false)
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-end mb-2 gap-3">
                        <Button variant='outline' onClick={() => (setFormEdit(false), initOrder())}>
                            Cancelar
                        </Button>
                        <Button variant='success' onClick={handleSubmit}>
                            Cotizar
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
}
