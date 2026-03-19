import OrdersClient from "@/api/services/OrdersClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ComponentLoader from "@/components/common/component-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder.tsx";
import { useEffect, useState } from "react";
import { OptionalMultimedia } from "./passport-multimedia";
import useInitOrder from "../providers/useOrder.tsx";

interface Passport {
    open: boolean;
    onOpenChange: () => void;
    info: PassengerInterface;
}

export function PassportPassengerModal({ open, onOpenChange, info }: Passport) {

    const { uuid, editPermissions, order } = useOrder();
    const ordersClient = new OrdersClient();
    const [passport, setPassport] = useState<PassportInterface>({});
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const { initOrder } = useInitOrder();
    const authConfig = useConfig();
    const url = window.location.href;
    const [passportLoaded, setPassportLoaded] = useState<boolean>(true);

    useEffect(() => {
        if (!uuid || !info || !open) return;
        setPassport({
            passport: info.passport,
            passport_expire_at: info.passport_expire_at,
            passport_status: info.passport_status,
            passport_url: info.passport_url,
        });
        if (info.passport_url !== "") {
            Passport();
        }
        setPassportLoaded(true);
    }, [info]);

    function showImage(action: string) {
        if (action === 'dowload') {
            window.location.href = `${url}/pasajero/${info.uid}/pasaporte?account=${authConfig.user.account}&download=true`
        } else {
            window.open(`${url}/pasajero/${info.uid}/pasaporte?account=${authConfig.user.account}`, '_blank')
        }
    }

    async function Passport() {
        if (!uuid || !info.uid) return;
        setLoadingOrder(true);
        try {
            const data = await ordersClient.orderReservationPsgPassport(uuid, info.uid);
            if (data) {
                toast.success('Se consulto el pasaporte correctamente');
            }
        } catch (e) {
            toast.error('No se logro cargar la información del pasajero');
            console.error(e);
        } finally {
            setLoadingOrder(false);
        }
    }

    async function handleSubmit() {
        if (!uuid || !info.uid || !order) return;

        const return_at = new Date(order.bloqueo.return_at);
        return_at.setMonth(return_at.getMonth() + 6);
        if (new Date(String(passport.passport_expire_at)) < return_at) {
            return toast.error(`La fecha registrada es inválida o ya pasó. 
                Recuerda que la fecha de vigencia del pasaporte debe ser de más de 6 meses 
                a la fecha de regreso del Bloqueo que es ${order.bloqueo.return_at}`)
        }
        setLoadingOrder(true);
        try {
            const data = await ordersClient.updatePassport(uuid, info.uid, {
                number: passport.passport,
                expire: passport.passport_expire_at,
            });

            if (data) {
                toast.success('Información actualizada correctamente');
                initOrder();
            }
        } catch (e) {
            toast.error(String(e));
            console.error(e);
        } finally {
            setLoadingOrder(false);
            onOpenChange();
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Información del pasajero
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {loadingOrder && <ComponentLoader />}
                    {passport && Object.keys(passport).length > 0 &&
                        <div className="row">
                            <div className="fw-semibold">
                                <Label>Pasajero: </Label> {info.title} {info.first_name} {info.first_last_name} {info.second_last_name}
                            </div>
                            <div>
                                [ UUID: <span className="badge badge-light-warning">{info.uid}</span> ]
                            </div>
                            <div className="callout callout-info cols-12 ">
                                <p>La fecha de expiración del pasaporte debe ser al menos 6 meses después de la salida.</p>
                                <p>Recuerda que la carga del documento puede tardar hasta 30 segundos</p>
                                <p>La imagen del pasaporte debe estar centrada mostrando los datos del pasajero de forma legible</p>
                            </div>
                            <div className="col-12 col-lg-5">
                                <div className="mt-2">
                                    <Label>Número de pasaporte <code>*</code></Label>
                                    <div className="mt-2" >
                                        <Input value={passport.passport ?? ''} onChange={(e) =>
                                            setPassport(p => { return { ...p, passport: e.target.value } })
                                        } />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Label>Fecha de expiración de pasaporte (DÍA-MES-AÑO) <code>*</code></Label>
                                    <div className="mt-2" >
                                        <Input type="date" value={passport?.passport_expire_at &&
                                            passport?.passport_expire_at !== '1900-01-01' ?
                                            passport.passport_expire_at :
                                            '2026-01-01'
                                        }
                                            onChange={(e) =>
                                                setPassport(p => { return { ...p, passport_expire_at: e.target.value } })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Label>Tipo de pasajero <code>*</code></Label>
                                    <div className="mt-2" >
                                        <Input disabled value={info.type ?? ''} />
                                    </div>
                                </div>
                                <div className={editPermissions ? "order border-dark rounded-0 mt-4" : "d-none"}>
                                    <OptionalMultimedia
                                        media={passport.passport_url ?? ''}
                                        onUploadComplete={() => {
                                            initOrder();
                                        }}
                                        puid={info?.uid ?? ''}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-lg-7 mt-4 mt-lg-0">
                                <div className="d-flex gap-2">
                                    <Button onClick={() => showImage('show')}>
                                        <i className="fas fa-external-link-alt"></i> Abrir en una ventana
                                    </Button>
                                    <Button onClick={() => showImage('dowload')} className="btn-warning">
                                        <i className="fas fa-cloud-download-alt"></i>Descargar
                                    </Button>
                                </div>
                                <div className="mt-2 tw-relative">
                                    {
                                        passport.passport_url &&
                                        passportLoaded &&
                                        <ComponentLoader />
                                    }
                                    {
                                        passport.passport_url?.length ?
                                            <iframe
                                                src={`/ordenes/reservaciones/${uuid}/pasajero/${info.uid}/pasaporte?account=user&t=${Date.now()}#toolbar=0`} className="frm_passport"
                                                id="frm_passport"
                                                onLoad={() => setPassportLoaded(false)}>
                                            </iframe>
                                            :
                                            <div className="tw-text-center">
                                                <span>Sin pasaporte</span>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </DialogBody>
                <DialogFooter>
                    <Button variant='outline' onClick={onOpenChange}>
                        Cancelar
                    </Button>
                    <Button variant='success' className={editPermissions ? "" : "d-none"} onClick={handleSubmit}>
                        Aceptar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
