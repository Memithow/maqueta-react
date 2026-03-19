import useOrder from "../hooks/useOrder.tsx";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {toast} from "sonner";
import ComponentLoader from "@/components/common/component-loader";
import {useToursOrder} from "../hooks/useToursOrder";
import OptionalsModal from "./optionals-modal";

export function ToursReservation() {
    const [loading, setLoading] = useState(false);
    const { updateOrderTours, deleteTour } = useToursOrder();
    const [openModalOptionals, setOpenModalOptionals] = useState<boolean>(false);

    const {
        selectTours,
        setSelectTours,
        rulesBloqueo,
        roomsInformation,
        psgPax,
        setRoomsInformation,
        editPermissions,
    } = useOrder();

    function modalOpen() {
        if (rulesBloqueo?.bloqueo?.mts?.tours?.length === 0) {
            toast.error("¡No hay opcionales disponibles!");
            return;
        }

        setOpenModalOptionals(true);
    }

    async function modalClose(){
        setOpenModalOptionals(false);
    }

    async function handleSendOptionalsPax(){
        setLoading(true);

        await updateOrderTours();

        setLoading(false);
    }

    function handleSelectQuantityTour(tour_selected: TourOrderInterface, quantity: string){
        if(countToursAssigned(tour_selected.tour.uid, tour_selected.code) > Number(quantity)){
            toast.error('Se está seleccionando una menor cantidad de tours de los que se ya encuentran seleccionados.');
            return ;
        }

        setSelectTours(prev =>
            prev.map(tour =>
                tour.uid === tour_selected.uid ?
                    {
                        ...tour,
                        quantity: Number(quantity),
                    } :
                    tour
            )
        );
    }

    async function handleDeleteTour(tour_selected: TourOrderInterface) {
        setLoading(true);
        let tour_to_delete = selectTours.filter(tour => tour.uid === tour_selected.uid);

        console.error(tour_to_delete)

        try {
            if (tour_to_delete) {
                const resp_tours_resume = await deleteTour(tour_to_delete);

                const order_tours_select = resp_tours_resume?.order?.services?.tours;

                if (!order_tours_select) return setSelectTours([]);

                setSelectTours(order_tours_select);
            }
        } catch (e) {
            toast.error("No se pudieron actualizar los opcionales.");
            console.error(e)
        } finally{
            setLoading(false);
        }
    }

    function countToursAssigned(tour_uid: string, code: string ): number{
        let count_tours_assigned = 0;
        const _code = code as "adt" | "mnr1" | "mnr2" | "mnr3" | "mnr";

        roomsInformation.forEach(({passengers}) => {
            const pax_with_tour = passengers.filter(({additionals, code}) => {
                if(code !== _code) return;
                return additionals.tours.some(({uid}) => uid === tour_uid)
            });

            count_tours_assigned += pax_with_tour.length ?? 0;
        });

        return count_tours_assigned;
    }

    function handleCheckTourPax(passenger_uid: string, tour: TourInterface, checked_state: boolean|string, code: string) {
        const tour_select = selectTours.find(tour_select => 
            tour_select.tour.uid === tour.uid &&  tour_select.code === code
        );

        if((!tour_select || countToursAssigned(tour.uid, code) >= tour_select.quantity) && checked_state){
            toast.error('Pasajeros asignados al tour, alcanzo el limite. Amplía los espacios solicitados.');
            return ;
        }

        setRoomsInformation(prev =>
            prev.map(room => {
                return {
                    ...room,
                    passengers: room.passengers.map(passenger => {
                        if (passenger.information.uid !== passenger_uid) return passenger;
                        // Copiamos el objeto passenger
                        const tours = passenger.additionals.tours || [];

                        // Si está marcado y el tour no existe, lo agregamos
                        let updatedTours = tours;
                        if (!tours.find(t => t.uid === tour.uid)) {
                            updatedTours = [...tours, tour];
                        } else {
                            // Si está desmarcado y el tour existe, lo quitamos
                            updatedTours = tours.filter(t => t.uid !== tour.uid);
                        }

                        return {
                            ...passenger,
                            additionals: {
                                ...passenger.additionals,
                                tours: updatedTours,
                            },
                        };
                    }),
                };
            })
        );
    }

    return (
        <div className="row">
            <div className={editPermissions ? "col-12 d-flex tw-justify-between py-5" : "d-none"}>
                <h3 className="fs-2 fw-bolder">Tours</h3>
                <Button
                    className="btn-light-primary"
                    onClick={modalOpen}
                >
                    Tours Opcionales
                </Button>
            </div>
            <div className="col-12">
                <div id="div_content_tours">
                    {loading && <ComponentLoader/>}
                    {
                        selectTours && psgPax &&
                        selectTours.map((tour, index) => (
                            <div className="row_tour" key={`tour_selected_${tour.tour.uid}_${index}`}>
                                <div className="row col-12 tour-title bg-light-warning text-warning p-2">
                                    <div className="col-1">
                                        <Select
                                            value={String(tour.quantity)}
                                            onValueChange={(value) => handleSelectQuantityTour(tour, value)}
                                        >
                                            <SelectTrigger size="sm">
                                                <SelectValue placeholder="0" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({
                                                    length: tour.code === "adt"
                                                        ? psgPax.adt + 1
                                                        : (psgPax.tot_mnr[tour.code] ?? 0) + 1,
                                                }).map((_, index_tour) => (
                                                    <SelectItem
                                                        value={String(index_tour)}
                                                        key={`tour_${tour.uid}_index_${index_tour}`}
                                                    >
                                                        {String(index_tour)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>
                                    <div className="col-md-9 py-2 text-start">
                                        <div className="tour-name fw-bold text-gray-700">
                                            {tour.tour.name} - {tour.code.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className={editPermissions ? "col-md-2 pe-0 text-end" : "d-none"} >
                                        <Button
                                            className="pull-right"
                                            variant="destructive"
                                            onClick={() => handleDeleteTour(tour)}
                                        >
                                            <i className="fas fa-times-circle"></i> Eliminar
                                        </Button>
                                    </div>
                                </div>
                                <div className="tour-pax p-2">
                                    {
                                        roomsInformation &&
                                        roomsInformation.map(({passengers}, index) =>
                                            <div key={`tour_rooms_index_${index}`} className="row">
                                                {
                                                    passengers.filter((pax) => pax.type === tour.code).length ?
                                                    <div className="col-12">
                                                        <strong className="mt-2">Habitación {index + 1}</strong>
                                                    </div> : ''
                                                }
                                                {
                                                    passengers.filter((pax) => pax.type === tour.code)
                                                        .map(({information, additionals, type}) =>
                                                        <div key={`tour_rooms_index_${index}_pax_${information.uid}`}
                                                             className="col-md-6 form-check form-check-custom form-check-sm p-2">
                                                            <Checkbox
                                                                checked={!!(additionals.tours.find(tour_check => tour_check.uid === tour.tour.uid))}
                                                                className="me-2 text-black"
                                                                id={`tour_${tour.tour.uid}_pax_${information.uid}`}
                                                                onCheckedChange={(checked_state) => handleCheckTourPax(information.uid, tour.tour, checked_state, type ?? '')}
                                                                value={(additionals.tours.find(tour_check => tour_check.uid === tour.tour.uid)) ? 'checked' : 'No checked'}
                                                            />
                                                            <label htmlFor={`tour_${tour.tour.uid}_pax_${information.uid}`}>
                                                                {`
                                                                    ${information.first_name}
                                                                    ${information.middle_name}
                                                                    ${information.first_last_name}
                                                                    ${information.second_last_name}
                                                                `}
                                                            </label>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                !selectTours.length &&
                <div id="div_content_tours">
                    <div className="callout callout-warning">
                        <h4>Tours opcionales</h4>
                        <p>Por el momento no hay opcionales asignados a la reserva</p>
                    </div>
                </div>
            }
            <div className="col-12 d-flex justify-content-end">
                {(editPermissions &&
                    selectTours.length > 0) &&
                    <Button onClick={handleSendOptionalsPax}>Actualizar tours</Button>
                }
            </div>

            {
                rulesBloqueo &&
                <OptionalsModal
                    open={openModalOptionals}
                    onOpenChange={modalClose}
                    title="Tours Opcionales"
                />
            }
        </div>
    );
}
