import { toast } from "sonner"
import OrdersClient from "@/api/services/OrdersClient";
import useOrder from "../hooks/useOrder";

export default function sendQuote() {
    const ordersApi = new OrdersClient();

    const {
        description,
        cc_email,
        customer,
        agent,
        selectTours,
        psgPax,
        roomsInformation,
        selectedBloqueo,
        uuid
    } = useOrder();

    async function submit() {
        try {
            if (!selectedBloqueo)
                return toast.error("No hay un bloqueo seleccionado");
            if (!customer || !agent)
                return toast.error("No ha seleccionado la información del cliente");
            if (roomsInformation.length === 0 || !psgPax)
                return toast.error("No ha seleccionado ninguna habitación");
            if (
                cc_email !== "" &&
                !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:;[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/.test(cc_email)
            )
                return toast.error("El correo con copia a, es invalido");

            let payload: Record<string, any> = {};
            let data = null;

            payload = {
                ...payload,
                only_ground: true,
                buid: selectedBloqueo.id,
                bloqueo_uid: selectedBloqueo.id,
                customer_model: customer.model,
                customer_mc: customer.cid_customer,
                customer_contact_mail: agent.email,
                customer_contact_phone: customer.phone,
                customer_contact_cc: agent.cc_email,
                quote_contact_way_id: 4,
                agency_contact_way_id: 4,
                customer_fn: agent.cid_funcionario,
                observations: description,
                rooms: roomsInformation,
                mnr: psgPax.mnr,
                tot_infants: psgPax.inf,
            };

            if (selectTours.length > 0) {
                payload.tours = selectTours.map((tour) => ({
                    uid: tour.tour.uid,
                    code: tour.code,
                    pax: tour.quantity,
                }));
            }

            if (uuid) {
                data = await ordersApi.updateQuote(payload, uuid);
                if (data) {
                    toast.success(String('¡La cotización, se creo con exito!'));
                    const url = window.location.href.split('/edit')[0];
                    window.location.href = url;
                }
            } else {
                data = await ordersApi.postQuote(payload);
                if (data) {
                    toast.success(String('¡La cotización, se creo con exito!'));
                    window.location.href = `${data.uid}`;
                }
            }
        } catch (e) {
            toast.error(String(e));
        } finally {
            return false;
        }
    }

    return { submit };
};
