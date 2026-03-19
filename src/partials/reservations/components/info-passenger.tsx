import OrdersClient from "@/api/services/OrdersClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ComponentLoader from "@/components/common/component-loader";
import { Input, InputAddon, InputGroup, TextArea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useInitOrder from "../providers/useOrder.tsx";
import { countries } from "../config/countries";
import moment from "moment";

interface PassportInterface {
    open: boolean;
    onOpenChange: () => void;
    info: PassengerInterface;
}

export function InfoPassengerModal({ open, onOpenChange, info }: PassportInterface) {

    const {
        uuid,
        rulesBloqueo,
        editPermissions,
    } = useOrder();
    const ordersClient = new OrdersClient();
    const [passenger, setPassenger] = useState<PassengerInterface>(info);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [passportLoaded, setPassportLoaded] = useState<boolean>(true);
    const [rangeAge, setRangeAge] = useState<{
        min: string,
        max: string,
    } | null>(null);
    const { initOrder } = useInitOrder();
    const url = window.location.href;
    const [country, setCountry] = useState<string>();

    const titles = {
        default: "Selecciona una opción",
        Mr: "Mr.",
        Mrs: "Mrs.",
        Miss: "Miss.",
        Jr: "Jr.",
    }

    useEffect(() => {
        if (!uuid || !info || !open) return;
        setPassenger(info);

        const passenger_type = rulesBloqueo?.passengers_types.find(({ code }) => info.code === code);

        if (!passenger_type || !passenger_type.rules) throw new Error('No se encuentran las reglas del pasajero.');

        const pax_rules = passenger_type.rules;
        let max_value = 0;
        let min_value = 90;

        if (pax_rules && pax_rules.length > 1) {
            let key_value_max = (pax_rules[0].value > pax_rules[1].value) ? 0 : 1;
            let key_value_min = (pax_rules[0].value > pax_rules[1].value) ? 0 : 1;
            max_value = Number(pax_rules[key_value_max].value);
            min_value = Number(pax_rules[key_value_min].value);
        } else {
            max_value = pax_rules[0].value;
        }

        setRangeAge({
            min: moment().subtract(min_value, 'y').format('YYYY-MM-DD'),
            max: moment().subtract(max_value, 'y').format('YYYY-MM-DD'),
        });

        Passport();
    }, [info]);

    async function Passport() {
        if (!uuid || !info.uid || info.passport_url === "") return;
        setLoadingOrder(true);
        try {
            const data = await ordersClient.orderReservationPsgPassport(uuid, info.uid);

            if (data) {
                setPassenger(p => {
                    return {
                        ...p,
                        passport_url: `${url}/pasajero/${info.uid}/pasaporte`
                    }
                })
            }
        } catch (e) {
            toast.error('No se logro cargar la información del pasajero');
            console.error(e);
        } finally {
            setLoadingOrder(false);
        }
    }

    function showImage(action: string) {
        if (action === 'dowload') {
            window.location.href = `${url}/pasajero/${info.uid}/pasaporte?&download=true`
        } else {
            window.open(`${url}/pasajero/${info.uid}/pasaporte`, '_blank')
        }
    }

    async function handleSubmit() {
        if (!uuid || !passenger?.uid) return;
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
            'Apellido materno': passenger.second_last_name,
            'Nombre': passenger.first_name,
            'Segundo nombre': passenger.middle_name,
        };

        const onlyLettersRegex = /^[A-Za-z]+$/;

        for (const [field, value] of Object.entries(nameFields)) {
            if (!onlyLettersRegex.test(value) && value.length > 0) {
                return toast.error(`El campo "${field} del pasajero" solo permite letras (A-Z) sin acentos, ni caracteres especiales`);
            }
        }

        setLoadingOrder(true);
        try {
            const data = await ordersClient.orderReservationPsgUpdate(uuid, passenger?.uid, {
                'title': passenger.title,
                'first_last_name': passenger.first_last_name,
                'second_last_name': passenger.second_last_name,
                'first_name': passenger.first_name,
                'middle_name': passenger.middle_name,
                'email': passenger.email,
                'phone': passenger.phone,
                'nationality': country ? country : passenger.nationality?.code,
                'birthday': passenger.birthday,
                'birthday_alternative_reason': null,
                'gender': passenger.gender,
                'notes': passenger.notes,
            });

            if (data) {
                initOrder();
                onOpenChange();
                toast.success('La información se actualizo con exito');
            }
        } catch (e) {
            console.error(e);
            onOpenChange();
            toast.error(String(e));
        } finally {
            setLoadingOrder(false);
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
                    <div className="container">
                        <div className="row gx-5">
                            <div className="callout callout-info cols-12 mt-0">
                                <ul className="tw-list-disc">
                                    <li>
                                        El nombre del pasajero solo acepta mayúsculas y espacios, por lo que el sistema
                                        en automático borrará acentos, caracteres especiales, números y letras
                                        minúsculas.
                                    </li>
                                    <li>
                                        El pasajero debe cumplir con la edad requerida hasta 6 meses después del regreso
                                        del Bloqueo.
                                    </li>
                                </ul>
                            </div>
                            <div className={`col-12 ${passenger?.passport_url ? 'col-lg-7' : ''}`}>
                                <div className="row">
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Título de pasajero <code>*</code></Label>
                                        <div className="mt-2">
                                            <Select
                                                onValueChange={(t) =>
                                                    setPassenger(p => {
                                                        return { ...p, title: t }
                                                    })
                                                }
                                                value={passenger?.title}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(titles).map(([key, t]) => (
                                                        <SelectItem
                                                            value={key}
                                                            key={key}
                                                        >
                                                            {t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Apellido paterno del pasajero<code>*</code></Label>
                                        <div className="mt-2">
                                            <Input value={passenger?.first_last_name ?? ''} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, first_last_name: e.target.value.toUpperCase() }
                                                })
                                            } />
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Apellido materno del pasajero</Label>
                                        <div className="mt-2">
                                            <Input value={passenger?.second_last_name ?? ''} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, second_last_name: e.target.value.toUpperCase() }
                                                })
                                            } />
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Nombre del pasajero<code>*</code></Label>
                                        <div className="mt-2">
                                            <Input value={passenger?.first_name ?? ''} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, first_name: e.target.value.toUpperCase() }
                                                })
                                            } />
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Segundo nombre del pasajero</Label>
                                        <div className="mt-2">
                                            <Input value={passenger?.middle_name ?? ''} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, middle_name: e.target.value.toUpperCase() }
                                                })
                                            } />
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Correo electrónico<code>*</code></Label>
                                        <div className="mt-2">
                                            <Input value={passenger?.email ?? ''} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, email: e.target.value }
                                                })
                                            } />
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Número Telefónico del pasajero<code>*</code></Label>
                                        <div className="mt-2">
                                            <Input value={passenger?.phone ?? ''} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, phone: e.target.value }
                                                })
                                            } />
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Nacionalidad del pasajero {passenger?.nationality?.code}<code>*</code></Label>
                                        <div className="mt-2" >
                                            <Select
                                                value={country ?? passenger?.nationality?.code}
                                                onValueChange={(c) => setCountry(c)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map((c, index) => (
                                                        <SelectItem
                                                            value={c.value}
                                                            key={index}
                                                        >
                                                            {c.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <hr className="mt-4 mb-2" />
                                    <div className="mt-2 col-12 callout callout-warning">
                                        <ul>
                                            <li className="tw-list-disc">
                                                Si requieres ingresar una fecha que no se encuentra disponible en el
                                                calendario deberás hacer clic en autorizar fecha.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Tipo de pasajero<code>*</code></Label>
                                        <div className="mt-2">
                                            <InputGroup>
                                                <InputAddon>
                                                    <i className="fa fa-tag"></i>
                                                </InputAddon>
                                                <Input disabled value={passenger?.type ?? ''} />
                                            </InputGroup>
                                        </div>
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Fecha de nacimiento (DÍA-MES-AÑO)<code>*</code></Label>
                                        <div className="mt-2">
                                            {
                                                rangeAge &&
                                                <InputGroup>
                                                    <InputAddon>
                                                        <i className="fa fa-calendar"></i>
                                                    </InputAddon>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            passenger?.birthday === "1900-01-01" ?
                                                                rangeAge.max : passenger?.birthday
                                                        }
                                                        onChange={(e) =>
                                                            setPassenger(p => {
                                                                return { ...p, birthday: moment(e.target.value).format('YYYY-MM-DD') }
                                                            })
                                                        }
                                                        min={rangeAge.min}
                                                        max={rangeAge.max}
                                                    />
                                                </InputGroup>
                                            }
                                        </div>
                                        {/*<div className="mt-4">
                                            <Button size='sm' className="btn-dark">
                                                Autorizar fecha
                                            </Button>
                                        </div>*/}
                                    </div>
                                    <div className="mt-2 col-12 col-md-6">
                                        <Label>Género:</Label>
                                        <div className="mt-2 d-flex tw-grid tw-gap-3">
                                            <div className="d-flex tw-grid tw-gap-2">
                                                <Checkbox
                                                    id="genero_m"
                                                    onCheckedChange={() => setPassenger(p => {
                                                        return {
                                                            ...p,
                                                            gender: 'male'
                                                        }
                                                    })}
                                                    checked={passenger?.gender === 'male'}
                                                    mode="circle"
                                                />
                                                <Label className="m-0" htmlFor="genero_m">Masculino</Label>
                                            </div>

                                            <div className="d-flex tw-grid tw-gap-2">
                                                <Checkbox
                                                    id="genero_f"
                                                    onCheckedChange={() => setPassenger(p => {
                                                        return {
                                                            ...p,
                                                            gender: 'female'
                                                        }
                                                    })}
                                                    checked={passenger?.gender === 'female'}
                                                    mode="circle"
                                                />
                                                <Label className="m-0" htmlFor="genero_f">Femenino</Label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="mt-4 mb-2" />
                                    <div className="mt-2 col-12">
                                        <Label>Notas del pasajero:</Label>
                                        <div className="mt-2 d-flex gap-2 ">
                                            <TextArea value={passenger?.notes} onChange={(e) =>
                                                setPassenger(p => {
                                                    return { ...p, notes: e.target.value }
                                                })
                                            } />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                passenger?.passport_url &&
                                <div className="col-12 col-lg-5 mt-4 mt-lg-0">
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
                                            passenger?.passport_url &&
                                            passportLoaded &&
                                            <ComponentLoader />
                                        }
                                        {
                                            passenger?.passport_url?.length ?
                                                <iframe
                                                    src={`/ordenes/reservaciones/${uuid}/pasajero/${info.uid}/pasaporte?account=user#toolbar=0`}
                                                    className="frm_passport"
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
                            }
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant='outline' onClick={onOpenChange}>
                        Cerrar
                    </Button>
                    <Button variant='success' className={editPermissions ? "" : "d-none"} onClick={handleSubmit}>
                        Guardar pasajero
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
