import OrdersClient from "@/api/services/OrdersClient";
import useOrder from "./useOrder";
import {toast} from "sonner";

interface ResumeToursOrder {
    pax: number,
    code: string,
    uid: string
}

export function useToursOrder() {
    const orderClient = new OrdersClient();
    const {
        selectTours,
        setSelectTours,
        uuid,
        roomsInformation,
        setRoomsInformation,
    } = useOrder();

    async function updateOrderTours() {
        try {
            const resp_tours_resume = await updateResumeTours();
            const order_tours_select = resp_tours_resume?.order?.services?.tours;

            setSelectTours(order_tours_select ?? []);

            const passengers_tours = await updatePassengersTours(order_tours_select);
            if (passengers_tours?.rooms) {
                setRoomsInformation(passengers_tours.rooms);
            }
        } catch (error: any) {
            toast.error(error.message);
            console.error(error);
        }
    }

    function deleteTour(tours_to_delete: TourOrderInterface[]){
        if (!uuid) throw new Error(`Tour ${uuid} not found.`);

        const resume_tours = tours_to_delete.map(tour => ({
            pax: 0,
            uid: tour?.tour?.uid ?? 'Tour no encontrado.',
            code: tour?.code
        }));

        return orderClient.postTours(uuid, resume_tours);
    }

    function updateResumeTours() {
        if (!uuid) throw new Error(`Tour ${uuid} not found.`);

        const resume_tours: {
            uid: any;
            code: "adt" | "mnr1" | "mnr2" | "mnr3" | "mnr" | undefined;
            pax: number | undefined
        }[] = selectTours.map(tour => ({
            pax: tour.quantity,
            uid: tour?.tour?.uid ?? 'Tour no encontrado.',
            code: tour.code,
        }));

        return orderClient.postTours(uuid, resume_tours);
    }

    function updatePassengersTours(order_tours_select: TourOrderInterface[]) {
        if (!uuid) throw new Error(`Tour ${uuid} not found.`);
        return orderClient.postToursPassengers(uuid, buildPassengersBody(order_tours_select));
    }

    function buildPassengersBody(select_tours: TourOrderInterface[]): Record<string, any> {
        if (!uuid) throw new Error(`Tour ${uuid} not found.`);

        const passengers: Record<string, string[]> = {};

        roomsInformation.forEach(({ passengers: pax }) => {
            pax.forEach(({ additionals, information, type }) => {
                if(!additionals || !additionals.tours) return;
                additionals.tours.forEach(tour => {
                    select_tours
                        .filter(select_tour =>
                            select_tour.tour && select_tour.tour.uid === tour.uid && select_tour.code === type
                        )
                        .forEach(select_tour => {
                            if (information && information.uid && !passengers[information.uid]) {
                                passengers[information.uid] = [];
                            }
                            passengers[information?.uid ?? 'error'].push(`${select_tour.uid}_${type}`);
                        });
                });
            });
        });

        return { passengers };
    }

    return { updateOrderTours, deleteTour };
}
