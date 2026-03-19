import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder.tsx";
import useGetOrder from "../hooks/useGetOrder";
import { useTotalOrder } from "../hooks/useTotalOrder";

export default function TableTours() {

    const { selectTours, setSelectTours, psgPax, model, order } = useOrder();
    const { formatPrice } = useGetOrder();
    const { tours } = useTotalOrder();

    function deleteTour(uuid: string, type: string) {
        setSelectTours(prev =>
            prev.filter((tour) => !(
                tour.tour.uid === uuid && type === tour.code
            )));
    }

    function addPax(uuid: string, type: string) {
        setSelectTours((prev) =>
            prev.map((tour) =>
                tour.tour.uid === uuid && tour.code === type
                    ? {
                        ...tour,
                        quantity:
                            tour.quantity ===
                                (tour.code === "adt"
                                    ? (psgPax?.adt ?? 0)
                                    : (psgPax?.tot_mnr[tour.code] ?? 0))
                                ? tour.code === "adt"
                                    ? (psgPax?.adt ?? 0)
                                    : (psgPax?.tot_mnr[tour.code] ?? 0)
                                : Number(tour.quantity + 1),
                    }
                    :
                    tour
            )
        );
    }

    function deletePax(uuid: string, type: string) {
        setSelectTours((prev) =>
            prev.map((tour) =>
                tour.tour.uid === uuid && tour.code === type
                    ? {
                        ...tour,
                        quantity:
                            Number(tour.quantity - 1) === 0
                                ? 1
                                : Number(tour.quantity - 1),
                    }
                    : tour
            ));
    }

    function totalTable() {
        if (model === 'reservation' && order) return formatPrice(tours);
        const total = selectTours.reduce((tt, tour) => {
            return tt += (Number(tour.price) * Number(tour.quantity))
        }, 0)
        return formatPrice(total);
    }

    return (
        psgPax && psgPax.adt > 0 &&
        <table className="table rounded table-tours">
            <thead>
                <tr>
                    <th>{(order && model === 'reservation') ? 'Tour' : 'Descripción de tour'}</th>
                    <th>Tipo de pasajero</th>
                    <th>Tarifa</th>
                    <th>Pasajeros</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {selectTours.map((tour) => (
                    <tr key={tour.tour.uid + tour.code}>
                        <td>{tour.tour.name}</td>
                        <td>{tour.code === "adt" ? "Adulto" : "Menor"}</td>
                        <td>
                            {formatPrice(Number(tour.price) ?? 0)}
                        </td>
                        <td className="fs-3">
                            <i
                                onClick={() =>
                                    deletePax(tour.tour.uid, tour.code)
                                }
                                className={
                                    `fas fa-minus-circle ${tour.quantity === 1
                                        ? "btn-numpax-inactive"
                                        : "btn-numpax-active"} ${(order && model === 'reservation') ? 'd-none' : ''}`
                                }
                            ></i>
                            {" " + tour.quantity + " "}
                            <i
                                onClick={() => addPax(tour.tour.uid, tour.code)}
                                className={
                                    `fas fa-plus-circle ${tour.quantity ===
                                        (tour.code === "adt"
                                            ? psgPax.adt
                                            : psgPax.tot_mnr[tour.code])
                                        ? "btn-numpax-inactive"
                                        : "btn-numpax-active"} ${(order && model === 'reservation') ? 'd-none' : ''}`
                                }
                            ></i>
                        </td>
                        <td>
                            {formatPrice(Number(tour.quantity || 0) *
                                Number(
                                    tour.price || 0
                                ))}
                        </td>
                        <td>
                            <Button
                                variant="destructive"
                                mode="icon"
                                onClick={() => deleteTour(tour.tour.uid, tour.code)}
                                className={(order && model === 'reservation') ? 'd-none' : ''}
                            >
                                <i className="fas fa-trash-can btn-del float-end p-0"></i>
                            </Button>
                        </td>
                    </tr>
                ))}
                <tr className="fw-bold">
                    <td colSpan={6}>
                        <div className="row d-flex justify-content-end">
                            <div className="col-12 col-md-6 col-lg-4 row">
                                <div className="col-8">Total tour(s):</div>
                                <div className="col-4 text-end">{totalTable()}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
