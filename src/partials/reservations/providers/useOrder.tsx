import { toast } from "sonner";
import OrdersClient from "@/api/services/OrdersClient.ts";
import useGetOrder from "../hooks/useGetOrder.tsx";
import useOrder from "../hooks/useOrder.tsx";
import mapOrder from "../helpers/mapOrder.tsx";

export default function useInitOrder() {

    const ordersApi = new OrdersClient();
    const { getAgent } = useGetOrder();
    const { bloqueoRules } = useGetOrder();
    const { Rooms } = mapOrder();

    const {
        setDescription,
        setSelectTours,
        setCountRooms,
        setSelectedBloqueo,
        uuid,
        setOrder,
        customer,
        agent,
        model,
        order,
    } = useOrder();

    async function initOrder() {
        if (!uuid) return;
        try {
            let data = order;

            if(model === 'reservation'){
                data = await ordersApi.showReservation(uuid);
            }

            if(model === 'quote'){
                data = await ordersApi.showQuote(uuid);
            }

            if (data?.customer_mc &&
                data?.customer_fn &&
                !customer && !agent
            ) {
                getAgent(
                    data?.customer_mc,
                    data?.customer_fn
                )
            }

            if (data) {
                setOrder(data);
                setDescription(data.observations);
                setCountRooms(data.rooms.length);
                setSelectedBloqueo({
                    id: data.bloqueo.uid,
                    text: data.bloqueo.name
                });
                Rooms(data.rooms);
                bloqueoRules(data.bloqueo.uid);
            }

            if (data?.order?.services?.tours) {
                setSelectTours(data.order.services.tours.map((tour) => ({
                    ...tour,
                    selected: true,
                })));
            }
        } catch (e) {
            toast.error('Error al cargar datos de la orden');
            console.error(e);
        }
    }

    return { initOrder };
}
