import OrdersClient from "@/api/services/OrdersClient";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { TextArea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder";
import { useState } from "react";
import useInitOrder from "../hooks/useOrder";
import ComponentLoader from "@/components/common/component-loader";

interface ModalProps {
    open: boolean;
    onOpenChange: () => void;
}

export default function ModalCancelation({
    open,
    onOpenChange,
}: ModalProps) {

    const { uuid, order, editPermissions } = useOrder();
    const orderClient = new OrdersClient();
    const [reazon, setReazon] = useState<string>();
    const { initOrder } = useInitOrder();
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit() {
        if (!uuid) return;
        setLoading(true);
        try {
            if (order && order.request_cancelation === false) {
                if (!reazon || reazon.length === 0) return toast.error('¡El motivo de cancelación es obligatorio!');
                const data = await orderClient.request_cancelation(uuid, reazon);
                if (data) {
                    toast.success('Solicitud de cancelación realizada con éxito' + ` [${uuid}]`);
                    initOrder();
                    onOpenChange();
                }
            } else {
                const data = await orderClient.request_cancelation_restore(uuid);
                if (data) {
                    toast.success('La solicitud ha sido cancelada para reserva:' + ' ' + uuid);
                    initOrder();
                    onOpenChange();
                }
            }
        } catch (e) {
            toast.error(String(e));
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Solicitud de Cancelación
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        {loading && <ComponentLoader />}
                        <div className="col-md-12">
                            <p className="fs-3 text-danger">¿Estás seguro(a) de realizar está acción?</p>
                        </div>

                        <div className="separator my-5"></div>

                        {(order && order.request_cancelation === false) ?
                            <div className="col-lg-12 fv-row">
                                <p className="no-margin">
                                    Estás a punto de realizar la cancelación de la reserva {uuid}.
                                </p>
                                <div className="alert alert-danger d-flex bg-light-danger rounded border-danger border border-dashed p-2 mb-0">
                                    <i className="fa fa-circle-exclamation fs-2tx text-danger me-4"></i>
                                    <div className="d-flex flex-stack flex-grow-1 ">
                                        <div className=" fw-semibold">
                                            <div className="fs-6 text-gray-700">
                                                <strong>¡Recuerda!</strong> Una vez realizada la cancelación, ya no se puede recuperar.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-2">
                                    <Label>Motivo de Cancelación: <code>*</code></Label>
                                    <div className="mt-2">
                                        <TextArea onChange={(e) => setReazon(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="callout callout-warning">
                                <p className="no-margin">
                                    La reserva {uuid} ya se encuentra en un proceso de cancelación.
                                </p>
                                <ul className="tw-list-disc">
                                    <li>¿Deseas detener el proceso de cancelación?</li>
                                </ul>
                            </div>
                        }
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="d-flex justify-content-end">
                        <Button variant='outline' onClick={onOpenChange}>
                            Cerrar ventana
                        </Button>
                        <Button className={editPermissions ? "" : "d-none"} variant='success' onClick={handleSubmit}>
                            Confirmar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}