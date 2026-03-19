import { toast } from "sonner"
import CustomersClient from "@/api/services/CustomersClient";
import OrdersClient from "@/api/services/OrdersClient";
import useOrder from "./useOrder";

export default function useGetOrder() {

    const customerApi = new CustomersClient();
    const ordersApi = new OrdersClient();
    const { setCustomer, setAgent, setRulesBloqueo, selectedBloqueo, rulesBloqueo, order, uuid } = useOrder()

    const getAgent = async (mc: string, fn: string) => {
        try {
            const customers = await customerApi.getClients(mc);
            const agents = await customerApi.getClientAgents(mc, fn);
            const _customer = customers.find(c => c.cid_customer === mc);
            const _agent = agents.find(a => a.cid_funcionario === fn);

            if ((uuid) && (!_customer || !_agent))
              toast.error('¡El cliente no se encuentra, o esta inactivo!');

            setCustomer(_customer);
            setAgent(_agent);
        } catch (e) {
            toast.error('¡El cliente no se encuentra, o esta inactivo!');
            console.error(e);
        }
    }

    const bloqueoRules = async (id?: string) => {
        if (!selectedBloqueo && !id) return;
        try {
            const rules_b = await ordersApi.showBloqueoRules(
                (selectedBloqueo ? selectedBloqueo.id : (id ? id : ''))
            );
            setRulesBloqueo(rules_b ?? null);
        } catch (e) {
            toast.error(String(e));
        }
    };

    function formatPrice(price: number) {
        return `$ ${(Number(price)).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${rulesBloqueo?.bloqueo.currency.code.toUpperCase()} `;
    }

    function getPassenger(uuid: string) {
        const passenger = order?.rooms.flatMap(r => r.passengers).find(
            p => p.information.uid === uuid
        )
        if (passenger) return {
            ...passenger.information,
            type: passenger.name,
            code: passenger.type,
            first_last_name: passenger.information.first_last_name.toUpperCase(),
            first_name: passenger.information.first_name.toUpperCase(),
            middle_name: passenger.information.middle_name.toUpperCase(),
            second_last_name: passenger.information.second_last_name.toUpperCase(),
        };
    }

    return { getAgent, bloqueoRules, formatPrice, getPassenger };
}