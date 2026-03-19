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
import ComponentLoader from "@/components/common/component-loader";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder.tsx";
import { useState } from "react";

interface ModalProps {
    open: boolean;
    onOpenChange: () => void;
}

export default function ModalEmail({
    open,
    onOpenChange,
}: ModalProps) {

    const { uuid } = useOrder();
    const orderClient = new OrdersClient();
    const [loading, setLoading] = useState<boolean>(false);

    async function orderSend() {
        if (!uuid) return;
        setLoading(true);
        try {
            const data = await orderClient.orderSend(uuid);
            if (data) {
                toast.success('Se ha enviado por correo la orden de compra:' + ' ' + uuid)
            }
        } catch (e) {
            toast.error(String(e));
            console.error(e)
        } finally {
            onOpenChange();
            setLoading(false);
        }
    }

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Enviar al Cliente
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        {loading && <ComponentLoader />}
                        <div className="col-md-12">
                            <p className="fs-3 text-danger">¿Estás seguro(a) de realizar está acción?</p>
                        </div>
                        <div className="callout callout-warning">
                            <p className="no-margin">
                                Estás a punto de enviar la reservación a tu cliente. Verifica que toda la información se encuentra correcta y completa.
                            </p>
                            <ul className="tw-list-disc">
                                <li>Verifica la información de tu cliente</li>
                                <li>¿Los opcionales y adicionales son correctos?</li>
                                <li>¿La reservación posee todo lo que tu cliente ha pedido?</li>
                                <li>¿Ya completaste el Mega Mail?</li>
                                <li>¿Los totales son correctos?</li>
                            </ul>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="d-flex justify-content-end">
                        <Button variant='outline' onClick={onOpenChange}>
                            Cerrar ventana
                        </Button>
                        <Button variant='success' onClick={orderSend}>
                            Confirmar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
