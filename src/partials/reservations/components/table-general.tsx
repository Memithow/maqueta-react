import useOrder from "../hooks/useOrder";
import useGetOrder from "../hooks/useGetOrder";
export function GeneralTab() {

    const { order } = useOrder();
    const { formatPrice } = useGetOrder();

    function totalRoom(room: RoomReservationInterface) {
        let total = 0;

        room.passengers.map(p => {
            total += (Number(p.price) + Number(p.tax))
            p.suplements && (total += p.suplements.reduce((total_s, s) => total_s += Number(s.price), 0))
        });

        return formatPrice(total);
    }

    return (
        <>
            {order?.rooms.map((room, index) => (
                <table key={index} className={`table rounded table-rooms ${index % 2 !== 1 ? 'bg-light-warning' : ''}`}>
                    <thead>
                        <tr>
                            <th>Habitación {index + 1} (Terrestre)</th>
                            <th></th>
                            <th>Tarifa Base</th>
                            <th>Impuestos</th>
                            <th>Suplementos</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {room.passengers.map(p => (
                            <tr key={p.information.uid}>
                                <td>
                                    {p.information.first_name === 'Pasajero' ?
                                        'Pasajero' :
                                        p.information.first_name + ' ' + (p.information.middle_name ?? '') + ' ' + p.information.first_last_name + ' ' + p.information.second_last_name
                                    }
                                    {p.information.main &&
                                        <i className="tw-pl-2 fas fa-star"></i>
                                    }
                                </td>
                                <td>
                                    <i className="fas fa-bus"></i>
                                </td>
                                <td>
                                    {formatPrice(Number(p.price))}
                                </td>
                                <td>
                                    {formatPrice(Number(p.tax))}
                                </td>
                                <td>
                                    {(p.suplements && p.suplements.length > 0) ?
                                        p.suplements.map(s => (
                                            <p key={s.name}>{`${s.name} - ${formatPrice(Number(s.price))}`}</p>
                                        ))
                                        :
                                        formatPrice(0)
                                    }
                                </td>
                                <td>
                                    {(p.suplements && p.suplements.length > 0) ?
                                        formatPrice(p.suplements.reduce((total_s, s) => total_s += Number(s.price), 0) + Number(p.tax) + Number(p.price))
                                        :
                                        formatPrice(Number(p.tax) + Number(p.price))
                                    }
                                </td>
                            </tr>
                        ))
                        }
                        <tr className="fw-bold">
                            <td colSpan={6}>
                                <div className="row d-flex justify-content-end">
                                    <div className="col-12 col-md-6 col-lg-8">
                                        Habitación {room.name}
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4 row">
                                        <div className="col-6">Total habitación:</div>
                                        <div className="col-6 text-end">{totalRoom(room)}</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ))}
        </>
    )
}