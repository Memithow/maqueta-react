import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogBody,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder.tsx";

interface OptionalModalInterface {
    open: boolean;
    onOpenChange: () => void;
    title: string;
}

export default function OptionalsModal({
    open,
    onOpenChange,
    title,
}: OptionalModalInterface) {
    const [tours, setTours] = useState<TourOrderInterface[]>([]);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const { selectTours, setSelectTours, psgPax, rulesBloqueo } = useOrder();

    function selectedTour(uuid: string, type: string) {
        setTours((tours) => {
            let newTours = tours.map((tour) =>
                tour.tour && tour.tour.uid === uuid && tour.code === type
                    ? { ...tour, selected: !tour.selected }
                    : tour
            );

            setCheckAll(false);
            let selectAll = newTours.filter((tour) => tour.selected === true);
            if (selectAll.length === newTours.length) setCheckAll(true);

            return newTours;
        });
    }

    function selectedPax(uuid: string, code: string, _pax: number) {
        setTours((tours) =>
            tours.map((tour) =>
                (tour.tour.uid === uuid &&
                    tour.code === code
                ) ? { ...tour, quantity: _pax } : tour
            )
        );
    }

    function selectAll() {
        if (!checkAll) {
            setTours((tours) =>
                tours.map((tour) => ({ ...tour, selected: true }))
            );
            setCheckAll(true);
        } else {
            setTours((tours) =>
                tours.map((tour) => ({ ...tour, selected: false }))
            );
            setCheckAll(false);
        }
    }

    function submitModal() {
        setSelectTours(tours.filter((tour) => tour.selected !== false));
        onOpenChange();
    }

    useEffect(() => {
        setTours([]);
        if (
            !rulesBloqueo ||
            !open ||
            !psgPax ||
            (rulesBloqueo?.bloqueo?.mts?.operators?.length === 0 &&
                rulesBloqueo?.bloqueo?.mts?.tours?.length === 0)
        ) {
            return;
        }

        setTours((tours_seting) => {
            let array = [...rulesBloqueo.bloqueo.mts.tours];

            // TODO: Revisar filtro de bloqueos
            if (
                Number(rulesBloqueo.bloqueo.destination_id) === 3 ||
                rulesBloqueo.bloqueo.mts.is_exa
            ) {
                array = rulesBloqueo.bloqueo.mts.tours.filter(
                    (tour) => Number(tour.show_web) === 1
                );
            }

            const departuredAt = new Date(
                `${rulesBloqueo.bloqueo.departured_at}T23:59:59.999Z`
            ).getTime();

            array = array.filter(tour => {
                return (
                    tour.show_web === 1 &&
                    (!tour.expire_at ||
                        (departuredAt <= new Date(tour.expire_at).getTime())) &&
                    (!tour.start_vigency ||
                        (departuredAt >= new Date(tour.start_vigency).getTime()))
                );
            });

            if (array.length === 0) {
                toast.error("¡No hay opcionales disponibles!");
                return [];
            }

            if (Number(psgPax.mnr) === 0) {
                return array.map((tour) => {
                    let selectTour = selectTours.some(
                        (_tour) => tour.uid === _tour.tour.uid
                    );
                    return {
                        tour: tour,
                        selected: selectTour ? true : false,
                        quantity: Number(psgPax.adt),
                        price: tour.tour_rates_same_currency[0].price,
                        code: "adt",
                    };
                });
            }

            let newArray: TourOrderInterface[] = [];
            array.map((tour) => {
                tour.tour_rates_same_currency.map((c) => {
                    let selectTour = selectTours.some(
                        (_tour) =>
                            _tour.tour && tour.uid === _tour.tour.uid && _tour.code === c.code
                    );
                    if (
                        c.code === "adt" ||
                        Number(psgPax.tot_mnr[c.code]) > 0
                    ) {
                        newArray.push({
                            tour: tour,
                            selected: selectTour ? true : false,
                            quantity:
                                String(c.code) === "adt"
                                    ? psgPax.adt
                                    : (psgPax.tot_mnr[c.code] ?? 0),
                            price: c.price,
                            code: c.code,
                        });
                    }
                });
            });

            return newArray;
        });
    }, [rulesBloqueo, open]);

    return (rulesBloqueo &&
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-3">
                        {title}
                        <p className="tw-text-input mt-1 fs-6">
                            Selecciona los tours opcionales y el número de pasajeros
                            para cada uno.
                        </p>
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div className="table-responsive-md tw-overflow-auto tw-max-h-[50vh]">
                        <table className="table table-sm fs-6 rounded table-hover">
                            <thead className="[&_th]:!tw-p-3 [&_th]:!tw-font-semibold">
                                <tr>
                                    <th>
                                        {tours.length > 0 ? (
                                            <Checkbox
                                                checked={checkAll}
                                                className="text-black"
                                                onCheckedChange={() =>
                                                    selectAll()
                                                }
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </th>
                                    <th>Tour</th>
                                    <th>Tipo de pasajero</th>
                                    <th>Tarifa</th>
                                    <th>Pasajeros</th>
                                </tr>
                            </thead>
                            <tbody className="[&_td]:tw-content-center bg-light-warning">
                                {tours.length > 0 ? (
                                    tours.map((tour, index) => (
                                        <tr key={index} className={tour.selected ? 'bg-light-warning' : ''}>
                                            <td align="center">
                                                <Checkbox
                                                    id={`tour_${tour.tour.uid}_${tour.code}`}
                                                    checked={tour.selected}
                                                    className="text-black"
                                                    onCheckedChange={() =>
                                                        selectedTour(
                                                            tour.tour.uid,
                                                            tour.code
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="tw-max-w-[50vw]">
                                                <div>
                                                    <label htmlFor={`tour_${tour.tour.uid}_${tour.code}`}>{tour.tour.name}</label>
                                                    <div className={tour.tour.is_refundable ? 'd-none' : 'mt-1'}>
                                                        <span className="text-warning">⚠ Opcional no reembolsable</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {tour.code === "adt"
                                                    ? "Adulto"
                                                    : "Menor"}
                                            </td>
                                            <td>
                                                ${" " + Number(tour.price).toLocaleString('es-MX') + " "}
                                                {rulesBloqueo.bloqueo.currency.code.toUpperCase()}
                                            </td>
                                            <td className="pe-2">
                                                <Select
                                                    disabled={!tour.selected}
                                                    value={String(tour.quantity)}
                                                    onValueChange={(quantity) =>
                                                        selectedPax(
                                                            tour.tour.uid, tour.code,
                                                            parseInt(quantity)
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger size="sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {psgPax && Array.from({
                                                            length:
                                                                String(
                                                                    tour.code
                                                                ) === "adt"
                                                                    ? psgPax.adt
                                                                    : (psgPax
                                                                        .tot_mnr[
                                                                        tour
                                                                            .code ?? 'adt'
                                                                    ]) ?? 0
                                                        }).map((_, index) => (
                                                            <SelectItem
                                                                value={String(
                                                                    index + 1
                                                                )}
                                                                key={index}
                                                            >
                                                                {index + 1}
                                                            </SelectItem>
                                                        ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            No hay datos disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="outline"
                            className="me-3"
                            onClick={onOpenChange}
                        >
                            Cerrar
                        </Button>
                        <Button onClick={() => submitModal()}>
                            Aceptar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
