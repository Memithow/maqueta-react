import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder.tsx";
import { useTotalOrder } from "../hooks/useTotalOrder";
import useGetOrder from "../hooks/useGetOrder";
import { useEffect, useState } from "react";

export default function TableProducts() {

    const { model, order } = useOrder();
    const { formatPrice } = useGetOrder();
    const { products } = useTotalOrder();
    const [_products, setProducts] = useState<Record<string, ProductInterface[]>>();

    function deleteExtra(uuid: string, type: string) {

    }

    function addPax(uuid: string, type: string) {

    }

    function deletePax(uuid: string, type: string) {

    }

    useEffect(() => {
        setProducts(undefined);
        if (!order || !(order?.order.services?.products)) return;
        const products = order.order.services.products.reduce(
            (groups: { [key: string]: ProductInterface[] }, p) => {
                const uuid = p.product_uid;
                if (!groups[uuid]) groups[uuid] = [];
                groups[uuid].push(p);
                return groups
            }, {});
        if (Object.keys(products).length > 0) setProducts(products)
    }, [order])

    return (
        <table className="table rounded table-products">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Porducto por</th>
                    <th>Costo</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {_products &&
                    Object.entries(_products).map(([key, p]) => (
                        <tr key={p[0].product_uid}>
                            <td>
                                {p[0].product_name}
                            </td>
                            <td>
                                {p[0].service_type === 'pax' ? 'Pasajero' : (
                                    p[0].service_type === 'reservation' ? 'Reservación' : 'Habitación'
                                )}
                            </td>
                            <td>
                                {p[0].price}
                            </td>
                            <td>
                                {p.length}
                            </td>
                            <td>
                                {formatPrice(Number(p[0].price) * Number(p.length))}
                            </td>
                            <td></td>
                        </tr>
                    ))
                }
                <tr className="fw-bold">
                    <td colSpan={6}>
                        <div className="row d-flex justify-content-end">
                            <div className="col-12 col-md-6 col-lg-4 row">
                                <div className="col-8">Total servicios integrados:</div>
                                <div className="col-4 text-end">{formatPrice(Number(products))}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
