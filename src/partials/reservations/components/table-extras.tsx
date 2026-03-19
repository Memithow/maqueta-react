import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder.tsx";
import { useTotalOrder } from "../hooks/useTotalOrder";
import useGetOrder from "../hooks/useGetOrder";

export default function TableExtras() {

    const { order } = useOrder();
    const { formatPrice } = useGetOrder();
    const { extras } = useTotalOrder();

    function deleteExtra(uuid: string, type: string) {

    }

    function addPax(uuid: string, type: string) {

    }

    function deletePax(uuid: string, type: string) {

    }

    return (
        <table className="table rounded table-freesales">
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
                {(order?.order.services?.extras && order.order.services.extras.length > 0) &&
                    order.order.services.extras.map(e => (
                        <tr key={e.uid + e.created}>
                            <td>
                                {e.description}
                            </td>
                            <td>
                                {e.price}
                            </td>
                            <td>
                                {e.quantity}
                            </td>
                            <td>
                                {formatPrice(Number(e.price) * Number(e.quantity))}
                            </td>
                            <td></td>
                        </tr>
                    ))
                }
                <tr className="fw-bold">
                    <td colSpan={5}>
                        <div className="row d-flex justify-content-end">
                            <div className="col-12 col-md-6 col-lg-4 row">
                                <div className="col-8">Total extra(s):</div>
                                <div className="col-4 text-end">{formatPrice(Number(extras))}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
