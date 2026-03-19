import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder.tsx";
import { useTotalOrder } from "../hooks/useTotalOrder";
import useGetOrder from "../hooks/useGetOrder";
import { useEffect, useState } from "react";

export default function TableIntegratedServices() {

    const { model, order } = useOrder();
    const { formatPrice } = useGetOrder();
    const { integrated_services } = useTotalOrder();
    const [services, setServices] = useState<Record<string, IntegratedServicesIterface[]>>();

    function deleteExtra(uuid: string, type: string) {

    }

    function addPax(uuid: string, type: string) {

    }

    function deletePax(uuid: string, type: string) {

    }

    useEffect(() => {
        setServices(undefined);
        if (!order || !(order?.order.services?.integrated_services)) return;
        const services = order.order.services.integrated_services.reduce(
            (groups: { [key: string]: IntegratedServicesIterface[] }, s) => {
                const uuid = s.uid;
                if (!groups[uuid]) groups[uuid] = [];
                groups[uuid].push(s);
                return groups
            }, {});
        if (Object.keys(services).length > 0) setServices(services)
    }, [order])

    return (
        <table className="table rounded table-integrated-services">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Costo</th>
                    <th>Número de personas</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {services &&
                    Object.entries(services).map(([key, s]) => (
                        <tr key={s[0].uid}>
                            <td>
                                {s[0].name}
                            </td>
                            <td>
                                {s[0].price}
                            </td>
                            <td>
                                {s.length}
                            </td>
                            <td>
                                {formatPrice(Number(s[0].price) * Number(s.length))}
                            </td>
                            <td></td>
                        </tr>
                    ))
                }
                <tr className="fw-bold">
                    <td colSpan={5}>
                        <div className="row d-flex justify-content-end">
                            <div className="col-12 col-md-6 col-lg-4 row">
                                <div className="col-8">Total servicios integrados:</div>
                                <div className="col-4 text-end">{formatPrice(Number(integrated_services))}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
