import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder.tsx";
import { useTotalOrder } from "../hooks/useTotalOrder";
import useGetOrder from "../hooks/useGetOrder";

export default function TableExtraNights() {

    const { order } = useOrder();
    const { formatPrice } = useGetOrder();
    const { night_pre, night_pos } = useTotalOrder();

    function deleteExtra(uuid: string, type: string) {

    }

    function addPax(uuid: string, type: string) {

    }

    function deletePax(uuid: string, type: string) {

    }

    return (
        <table className="table rounded table-nights">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Costo</th>
                    <th>Número de personas</th>
                    <th>Número de noches</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {(order?.order.services?.extra_nights && Object.keys(order.order.services.extra_nights).length > 0) &&
                    Object.entries(order.order.services.extra_nights).map(([key, n]) => (
                        <tr key={key}>
                            <td>
                                {key === 'pre' ? 'Noches previas' : 'Noches posteriores'}
                            </td>
                            <td>
                                {formatPrice(Number(n.rate))}
                            </td>
                            <td>
                                {n.quantity}
                            </td>
                            <td>
                                {n.nights}
                            </td>
                            <td>
                                {formatPrice(Number(n.rate) * Number(n.quantity))}
                            </td>
                            <td></td>
                        </tr>
                    ))
                }
                <tr className="fw-bold">
                    <td colSpan={6}>
                        <div className="row d-flex justify-content-end">
                            <div className="col-12 col-md-6 col-lg-4 row">
                                <div className="col-8">Total noches adicionales:</div>
                                <div className="col-4 text-end">{formatPrice(Number(night_pre + night_pos))}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
