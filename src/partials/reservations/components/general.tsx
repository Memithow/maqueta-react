import useOrder from "../hooks/useOrder";
import TableTours from "./table-tours";
import { Label } from "@/components/ui/label";
import { GeneralTab } from "./table-general";
import useGetOrder from "../hooks/useGetOrder";
import TableExtras from "./table-extras";
import TableIntegratedServices from "./table-integrated_services";
import TableInsurances from "./table-insurances";
import TableProducts from "./table-products";
import TableExtraNights from "./table-extra-nights";
import { useTotalOrder } from "../hooks/useTotalOrder";

export function General() {

    const { order, selectTours } = useOrder();
    const { formatPrice } = useGetOrder();
    const { products, extras } = useTotalOrder();

    function headTabs(t: string) {
        return (
            <div className="my-2 row fw-bold">
                <div className="col-12 col-md-6 col-lg-4">
                    {t}
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    Desglose de costos
                </div>
            </div>
        )
    }

    return (
        <div className="col-12 p-5 row">
            <div className="mt-3 fw-bold col-12">
                <div className="fs-4">Información General</div>
                <div className="mt-2 row">
                    <Label className="col-12 col-md-6 col-lg-4">Número de Habitaciones: {order?.count_rooms} habitacion(es)</Label>
                    <Label className="col-12 col-md-6 col-lg-4">Cantidad de Pasajeros: {order?.count_passengers} pasajero(s)</Label>
                </div>
            </div>

            <div className="col-12">
                {headTabs('Habitaciones/Pasajeros')}
                <GeneralTab />
            </div>

            {selectTours.length > 0 &&
                <div className="col-12">
                    {headTabs('Tours opcionales')}
                    <TableTours />
                </div>
            }

            {(order?.order.services?.extras && order.order.services.extras.length > 0) &&
                <div className="col-12">
                    {headTabs('Ventas libres')}
                    <TableExtras />
                </div>
            }

            {(order?.order.services?.integrated_services && order.order.services.integrated_services.length > 0) &&
                <div className="col-12">
                    {headTabs('Servicios integrados')}
                    <TableIntegratedServices />
                </div>
            }

            {(order?.order.services?.insurances && order.order.services.insurances.length > 0) &&
                <div className="col-12">
                    {headTabs('Asistencias de viaje')}
                    <TableInsurances />
                </div>
            }

            {(order?.order.services?.products && order.order.services.products.length > 0) &&
                <div className="col-12">
                    {headTabs('Productos')}
                    <TableProducts />
                </div>
            }

            {(order?.order.services?.extra_nights && Object.keys(order.order.services.extra_nights).length > 0) &&
                <div className="col-12">
                    {headTabs('Noches adicionales')}
                    <TableExtraNights />
                </div>
            }

            <div className="col-12 row d-flex justify-content-end">
                <div className="col-12 col-md-6 col-lg-4 row  text-end">
                    <div className="col-6 fw-bold fs-4">Total:</div>
                    <div className="col-6 fw-bold fs-4">{formatPrice(Number(order?.order.total) + products + extras)}</div>
                </div>
            </div>
        </div>
    )
}