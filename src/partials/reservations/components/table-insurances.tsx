import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder.tsx";
import { useTotalOrder } from "../hooks/useTotalOrder";
import useGetOrder from "../hooks/useGetOrder";

export default function TableInsurances() {

    const { order } = useOrder();
    const { formatPrice } = useGetOrder();
    const { insurances } = useTotalOrder();

    function deleteExtra(uuid: string, type: string) {

    }

    function addPax(uuid: string, type: string) {

    }

    function deletePax(uuid: string, type: string) {

    }

    return (
        <table className="table rounded table-insurances">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Cobertura</th>
                    <th>Persona mayor</th>
                    <th>Precio por día</th>
                    <th>Dias</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {(order?.order.services?.insurances && order.order.services.insurances.length > 0) &&
                    order.order.services.insurances.map(e => (
                        <tr key={e.uid}>
                            <td>
                                {e.name}
                            </td>
                            <td>
                                {e.insurer}
                            </td>
                            <td>
                                {e.is_elderly === 1 ? 'Si' : 'No'}
                            </td>
                            <td>
                                {formatPrice(Number(e.price_day))}
                            </td>
                            <td>
                                {e.days}
                            </td>
                            <td>
                                {formatPrice(Number(e.price_day) * Number(e.days))}
                            </td>
                            <td></td>
                        </tr>
                    ))
                }
                <tr className="fw-bold">
                    <td colSpan={7}>
                        <div className="row d-flex justify-content-end">
                            <div className="col-12 col-md-6 col-lg-4 row">
                                <div className="col-8">Total asistencia(s):</div>
                                <div className="col-4 text-end">{formatPrice(Number(insurances))}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
