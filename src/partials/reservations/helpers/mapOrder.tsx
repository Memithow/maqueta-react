import { toast } from "sonner"
import useOrder from "../hooks/useOrder";

export default function mapOrder() {
    const {
        selectTours,
        setPsgPax,
        setSelectTours,
        setRoomsInformation,
        model,
        order,
    } = useOrder();

    function Rooms(rooms: RoomReservationInterface[]) {
        let rooms_information: RoomsToOrderInterface[];

        if (model === "reservation") {
            rooms_information =
                rooms.map((room) => {
                    let _room = {
                        ...room,
                        adt: 0,
                        mnr: 0,
                        tot_infants: 0,
                        rate: '2',
                        type: room.code,
                        passengers: room.passengers.map((p) => {
                            if (p.type !== 'adt') {
                                return {
                                    ...p,
                                    minor_type: p.type,
                                    age: p.birthday,
                                    code: p.type,

                                }
                            } else {
                                return {
                                    ...p,
                                    age: p.birthday,
                                    code: p.type,
                                }
                            }
                        })
                    }
                    room.passengers.map((p) => {
                        if (p.type === 'adt') _room.adt = _room.adt + 1;
                        if (p.type === 'mnr1') _room.mnr = _room.mnr + 1;
                        if (p.type === 'mnr2') _room.mnr = _room.mnr + 1;
                        if (p.type === 'mnr3') _room.mnr = _room.mnr + 1;
                        if (p.type === 'inf') _room.tot_infants = _room.tot_infants + 1;
                    })
                    return _room;
                });
        } else {
            rooms_information =
                rooms.map(room => {
                    let _room = {
                        ...room,
                        adt: 0,
                        mnr: 0,
                        tot_infants: 0,
                        rate: "2",
                        passengers: room.passengers.map((p) => {
                            if (p.code !== 'adt') {
                                return {
                                    ...p,
                                    minor_type: p.code
                                }
                            } else {
                                return p
                            }
                        })
                    }
                    room.passengers.map(p => {
                        if (p.code === 'adt') _room.adt = _room.adt + 1;
                        if (p.code === 'mnr1') _room.mnr = _room.mnr + 1;
                        if (p.code === 'mnr2') _room.mnr = _room.mnr + 1;
                        if (p.code === 'mnr3') _room.mnr = _room.mnr + 1;
                        if (p.code === 'inf') _room.tot_infants = _room.tot_infants + 1;
                    })
                    return _room;
                });
        }

        setRoomsInformation(rooms_information);
        setPsgPax(paxRooms(rooms_information))
    }

    function paxRooms(rooms_information: RoomsToOrderInterface[]) {
        let _pax: RoomPaxInterface = {
            adt: 0,
            inf: 0,
            mnr: 0,
            tot_mnr: {
                mnr1: 0,
                mnr2: 0,
                mnr3: 0
            }
        };
        try {
            rooms_information.map((room) => {
                _pax.adt = (_pax.adt ?? 0) + Number(room.adt);
                _pax.inf = (_pax.inf ?? 0) + Number(room.tot_infants);
                _pax.mnr = (_pax.mnr ?? 0) + Number(room.mnr);
                _pax.tot_mnr = {
                    mnr1:
                        (_pax?.tot_mnr?.mnr1 ?? 0) +
                        Number(
                            room.passengers.filter(
                                (p) => p.minor_type === "mnr1"
                            ).length
                        ),
                    mnr2:
                        (_pax?.tot_mnr?.mnr2 ?? 0) +
                        Number(
                            room.passengers.filter(
                                (p) => p.minor_type === "mnr2"
                            ).length
                        ),
                    mnr3:
                        (_pax?.tot_mnr?.mnr3 ?? 0) +
                        Number(
                            room.passengers.filter(
                                (p) => p.minor_type === "mnr3"
                            ).length
                        ),
                };
            });
        } catch (e) {
            toast.error(String(e));
            console.error(e);
        }

        resetPax(_pax);
        return _pax;
    }

    function resetPax(_pax: RoomPaxInterface) {
        if (order && model === 'reservation') return;
        if (_pax.adt === 0) {
            setSelectTours([]);
        } else {
            try {
                setSelectTours(selectTours.map((tour) => ({
                    ...tour,
                    quantity:
                        tour.code === "adt"
                            ? _pax.adt
                            : (_pax.tot_mnr[tour?.code ?? 'adt'] ?? 0),
                })).filter(tour => tour.quantity !== 0));
            } catch (e) {
                toast.error(String(e));
                console.error(e);
            }
        }
    }

    return { Rooms, paxRooms };
}
