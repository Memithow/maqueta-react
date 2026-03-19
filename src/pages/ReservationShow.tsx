import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import useInitOrder from "@/partials/reservations/providers/useOrder.tsx";
import useOrder from "@/partials/reservations/hooks/useOrder.tsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import RoomsReservation from "@/partials/reservations/components/rooms-reservation";
import { ToursReservation } from "@/partials/reservations/components/tours-reservation";
import { OrderActions } from "@/partials/reservations/components/order-actions";
import { Observations } from "@/partials/reservations/components/observations";
import { General } from "@/partials/reservations/components/general";
import ModalEmail from "@/partials/reservations/components/modal-email";
import ModalCancelation from "@/partials/reservations/components/modal-cancelation";
import ComponentLoader from "@/components/common/component-loader";
import { PassengerModal } from "@/partials/reservations/components/passenger-modal";
import { toast } from "sonner"

export default function ReservationShow() {
    const { order, uuid } = useOrder();
    const { initOrder } = useInitOrder();
    const [tab, setTab] = useState<string>('general');
    const [modal, setModal] = useState<boolean>(false);
    const [cancelation, setCancelation] = useState<boolean>(false);
    const [formEdit, setFormEdit] = useState<boolean>(false);

    const tabs = [
        { name: 'Información General', id: 'general', icon: 'fa-circle-info' },
        { name: 'Información de Pasajeros', id: 'passengers', icon: 'fa-users' },
        { name: 'Observaciones', id: 'observations', icon: 'fa-comment' },
        { name: 'Tours Opcionales', id: 'optionals', icon: 'fa-bus' },
    ];

    const infoItems = [
        {
            label: "Cliente Agencia",
            icon: "fa-user",
            value: order?.customer_mc,
            extra: order?.customer_name
        },
        {
            label: "Agente de Contacto",
            icon: "fa-user",
            value: order?.customer_fn,
            extra: order?.customer_name
        },
        {
            label: "Correo Electrónico",
            icon: "fa-envelope",
            value: order?.customer_contact_mail
        }
    ];

    function statusLabel() {
        const status = order?.bloqueo?.status?.name;

        if (status) {
            const style = status === "Activo" ? "badge-info" : (
                (status === "Cerrado" || status === "Emisión") ? "badge-warning" : (
                    status === "Cancelado" ? "badge-danger" : ''
                )
            )

            return <span className={`tw-ml-2 p-2 badge ${style}`}>
                {status}
            </span>;
        }
    };

    useEffect(() => {
        initOrder();
    }, []);

    function passengerMain() {
        if (!order) return;
        const passenger = order.rooms[0].passengers[0].information;
        const main = order.rooms.some(r => {
            return r.passengers.some(p => p.information.main === true)
        })

        return <PassengerModal
            onOpenChange={() => { }}
            open={!main}
            info={passenger}
        />
    }

    function changeTab(_tab: string) {
        if(_tab === 'optionals' && formEdit) return toast.error('Cancela el modo edición en "Información de pasajeros"')
        setTab(_tab)
    }

    return (
        <div className="row">
            {!order && <ComponentLoader />}
            <div className="col-12 row" id="header">

                <ModalEmail
                    open={modal}
                    onOpenChange={() => setModal(false)}
                />
                <ModalCancelation
                    open={cancelation}
                    onOpenChange={() => setCancelation(false)}
                />

                {passengerMain()}

                <div className="col-lg-10 col-sm-10 col-xs-10 fv-row pb-0">
                    <h4 className="fw-bold text-gray-800">
                        Salida: {order && order.bloqueo.program.name} - {order && order.bloqueo.departure_at}
                        {statusLabel()}
                    </h4>
                    <Label>Fecha de Creación:</Label>
                    {order && (
                        <Label className="tw-ml-2 fs-7 fw-bold">
                            {format(
                                new Date(order.created_at.replace(" ", "T")),
                                "dd/MMM/yyyy HH:mm",
                                { locale: es }
                            ).toUpperCase()}
                        </Label>
                    )}
                </div>
                <div className="col-lg-2 col-sm-2 col-xs-2 pb-0 text-end">
                    {(order?.status.id === 1 || order?.status.id === 2 ||
                        order?.status.id === 3 || order?.status.id === 5) &&
                        <OrderActions setModal={setModal} setCancelation={setCancelation} />
                    }
                </div>

                {(order?.status.id === 4 || order?.status.id === 7 ||
                    order?.status.id === 6) &&
                    <>
                        <div className="separator my-5"></div>
                        <div className="col-lg-12 fv-row">
                            <div className="alert alert-danger d-flex bg-light-danger rounded border-danger border border-dashed p-4 mb-0">
                                <div className="d-flex tw-place-items-center">
                                    <i className="fa fa-circle-exclamation fs-2tx text-danger me-4"></i>
                                </div>
                                <div className="d-flex flex-stack flex-grow-1 ">
                                    <div className=" fw-semibold">
                                        <div className="fs-5 text-gray-700 ">
                                            {`Reservación: ${uuid} cancelada`}.
                                        </div>
                                        {(order.cancel_reason && order.cancel_reason.length > 0) &&
                                            <div className="fs-6 text-gray-700 ">
                                                Motivo de cancelación: {order.cancel_reason}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {(order?.expedient && order?.expedient.length > 0) &&
                    <>
                        <div className="separator my-5"></div>
                        <div className="row">
                            <div className="col-md-4 fv-row">
                                <Label>Expediente: </Label>
                                <div className="fw-bold fs-7 text-gray-800">
                                    <span className='badge badge-light-primary'>{order.expedient}</span>
                                </div>
                            </div>
                            <div className="col-md-4 fv-row">
                                <Label>Registro de Expdiente: </Label>
                                <div className="fw-bold fs-7 text-gray-800">
                                    <span className="align-items-center text-gray-600 text-hover-primary me-2 badge badge-light-success">
                                        {order.registered_expedient_at}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <div className="separator my-5"></div>
                <div className="row">
                    {infoItems.map((item, index) => (
                        <div className="col-md-4 fv-row pb-5" key={index}>
                            <Label>{item.label}:</Label>
                            <div className="fw-bold fs-7 text-gray-800">
                                <span className="align-items-center text-gray-600 text-hover-primary me-2 badge badge-light-success">
                                    <i className={`fa ${item.icon} pe-2`}></i> {item.value}
                                </span>
                                {item.extra && item.extra}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-4">
                        <Label>Reservación Enviada:</Label>
                        {order?.sended ?
                            <div className="tw-ml-2 fw-bold fs-7 text-gray-600">
                                {format(
                                    new Date(order.created_at.replace(" ", "T")),
                                    "dd/MMM/yyyy HH:mm",
                                    { locale: es }
                                ).toUpperCase()}
                            </div>
                            :
                            <span className="fw-bold fs-7 text-gray-600">Sin envío</span>
                        }
                    </div>
                </div>
                <div className="col-12">
                    <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
                        {order && tabs.map(_tab => {
                            if ((order.status.id === 4 || order.status.id === 7 ||
                                order.status.id === 6) && _tab.id !== 'general') {
                                return
                            }

                            return (
                                <li key={_tab.icon} className="nav-item mt-2" onClick={() => changeTab(_tab.id)}>
                                    <a className={`nav-link tw-cursor-pointer ${_tab.id === tab ? 'active' : ''}`}>
                                        <i className={`fa ${_tab.icon} pe-3`}></i>
                                        {_tab.name}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className="col-12 tw-min-h-[50vh]" id="body">
                {tab === 'general' &&
                    <General />
                }
                {tab === 'passengers' &&
                    <RoomsReservation
                        formEdit={formEdit}
                        setFormEdit={(b) => setFormEdit(b)}
                    />
                }
                {tab === 'observations' &&
                    <Observations />
                }
                {tab === 'optionals' &&
                    <ToursReservation />
                }
                {tab === 'additionals' &&
                    <></>
                }
                {tab === 'documents' &&
                    <></>
                }
            </div>
            <div className="col-12" id="footer">
            </div>
        </div >
    )
}
