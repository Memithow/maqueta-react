import OrdersClient from "@/api/services/OrdersClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input, InputAddon, InputGroup } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder.tsx";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import useInitOrder from "../providers/useOrder.tsx";

interface PassengerModalInterface {
    open: boolean;
    onOpenChange: () => void;
    info: PassengerInterface;
}

export function PassengerModal({ onOpenChange, open, info }: PassengerModalInterface) {

    const ordersClient = new OrdersClient();
    const { uuid, editPermissions } = useOrder();
    const [passenger, setPassenger] = useState<PassengerInterface>(info);
    const { initOrder } = useInitOrder();

    async function handleMain() {
        if (!uuid || !passenger || !info.uid) return;
        if (passenger.first_last_name === "")
            return toast.error("El apellido paterno del pasajero, es obligatorio");
        if (passenger.first_name === "")
            return toast.error("Nombre del pasajero, es obligatorio");
        if (
            passenger.email === "" &&
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:;[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/.test(passenger.email)
        )
            return toast.error("El correo con copia a, es invalido");
        if (passenger.phone === "0" || !/^\d+$/.test(String(passenger.phone)))
            return toast.error("El telefono, es invalido");

        const nameFields = {
            'Apellido paterno': passenger.first_last_name,
            'Nombre': passenger.first_name,
        };

        const onlyLettersRegex = /^[A-Za-z]+$/;

        for (const [field, value] of Object.entries(nameFields)) {
            if (!onlyLettersRegex.test(value) && value.length > 0) {
                return toast.error(`El campo "${field} del pasajero" solo permite letras (A-Z) sin acentos, ni caracteres especiales`);
            }
        }

        try {
            const data = await ordersClient.orderReservationPsgMain(uuid, info.uid,
                {
                    main: true,
                    title_pax: info.title,
                    first_name: passenger.first_name,
                    middle_name: info.middle_name,
                    first_last_name: passenger.first_last_name,
                    second_last_name: info.second_last_name,
                    email: passenger.email,
                    phone: passenger.phone
                }
            );
            if (data) {
                onOpenChange();
                initOrder();
                toast.success('Informacion actualizada correctamente')
            }
        } catch (e) {
            onOpenChange();
            console.error(e);
            toast.error(String(e))
        }
    }

    useEffect(() => {
        if (Object.keys(info).length === 0 || !open) return;
        setPassenger(info)
    }, [info]);

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="fw-semibold text-white">
                        Información de pasajero principal
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div className="alert alert-info">
                        <i className="fa fa-info-circle me-2"></i>
                        Se asignará como pasajero principal el primer adulto de la primera habitación. Podrás cambiarlo una vez completada la reserva.
                    </div>
                    <div className="row g-3">
                        <div className="col-12 col-sm-6">
                            <Label>Apellido paterno del pasajero <code>*</code></Label>
                            <div className="mt-2">
                                <InputGroup>
                                    <InputAddon>
                                        <i className="fa fa-male"></i>
                                    </InputAddon>
                                    <Input value={passenger?.first_last_name ?? ''} onChange={(e) => setPassenger(p => {
                                        return {
                                            ...p,
                                            first_last_name: e.target.value.toUpperCase()
                                        }
                                    })} />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <Label>Nombre del pasajero <code>*</code></Label>
                            <div className="mt-2">
                                <InputGroup>
                                    <InputAddon>
                                        <i className="fa fa-male"></i>
                                    </InputAddon>
                                    <Input value={passenger.first_name === 'PASAJERO' ? '' : passenger.first_name} onChange={(e) => setPassenger(p => {
                                        return {
                                            ...p,
                                            first_name: e.target.value.toUpperCase()
                                        }
                                    })} />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <Label>Correo electrónico<code>*</code></Label>
                            <div className="mt-2">
                                <InputGroup>
                                    <InputAddon>
                                        <i className="fa fa-envelope"></i>
                                    </InputAddon>
                                    <Input value={passenger?.email ?? ''} onChange={(e) => setPassenger(p => {
                                        return {
                                            ...p,
                                            email: e.target.value
                                        }
                                    })} />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <Label>Teléfono del pasajero <code>*</code></Label>
                            <div className="mt-2">
                                <InputGroup>
                                    <InputAddon>
                                        <i className="fa fa-phone"></i>
                                    </InputAddon>
                                    <Input value={passenger?.phone ?? ''} onChange={(e) => setPassenger(p => {
                                        return {
                                            ...p,
                                            phone: e.target.value
                                        }
                                    })} />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="d-flex justify-content-end gap-2">
                        <Button onClick={onOpenChange} variant='outline'>
                            Cancelar
                        </Button>
                        <Button onClick={handleMain} className={editPermissions ? "" : "d-none"} variant='success'>
                            Aceptar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}