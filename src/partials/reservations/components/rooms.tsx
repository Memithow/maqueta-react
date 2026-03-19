import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import useOrder from "../hooks/useOrder.tsx";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getMaxCountsByRoom,
  type PassengerRulesCountInterface,
} from '../helpers/PassengerRules';
import ModalRules from "./modal-rules";


interface RoomData{
    id: string;
}

const RoomSelector = forwardRef (({}, ref) => {
    const [openModalRules, setOpenModalRules] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const {
        countRooms,
        setCountRooms,
        roomsInformation,
        setRoomsInformation,
        rulesBloqueo,
        uuid,
        order,
        model,
    } = useOrder();

    const room_default = (): RoomData => {
        return {
            id: uuidv4()
        }
    }

    useEffect(() => {
        if(uuid) return;
        setRooms([]);
    }, [rulesBloqueo]);

    useEffect(() => {
        onSelectCountRooms();
    }, [countRooms]);

    useEffect(() => {
        if (uuid) {
            let _rooms = roomsInformation.map(() => room_default());
            setRooms(_rooms);
        }
    }, [uuid])

    useImperativeHandle(ref, () => ({
        addRoom()  {
            if (!rulesBloqueo) return;
            const newRoom: RoomData = room_default();
            setRooms(prev => [...prev, newRoom]);
            setCountRooms( countRooms + 1);
        },
    }));

    function onSelectCountRooms() {
        if (rulesBloqueo && rooms.length !== countRooms) {
            if (countRooms > rooms.length) {
                const dif_roms = countRooms - rooms.length;
                let counter = 1;
                while (counter <= dif_roms) {
                    setRooms(prev => [...prev, room_default()]);
                    counter++;
                }

            } else {
                setRooms(prev => prev.filter((room, index) => index <= (countRooms - 1)));
                setRoomsInformation(prev => prev.filter((room, index) => index <= (countRooms - 1)));
            }
        }
    }

    function removeRoom(id: string) {
        const index_room = rooms.findIndex(elem => elem.id === id);
        setRooms(prev => prev.filter(room => room.id !== id));
        setRoomsInformation(prev => prev.filter((room, index) => index_room !== index));
        setCountRooms( countRooms - 1);
    }

    function handleRoomChange(roomNumber: number, data: RoomsToOrderInterface) {
        if(data.passengers.length === 0) return;
        setRoomsInformation(prev => {
            const existingIndex = prev.findIndex((room, index) => index === roomNumber);
            let  updated = [...prev];
            if (existingIndex !== -1) {
                updated[existingIndex] = data;
            } else {
                updated = [...prev, data];
            }
            return updated;
        });
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <h5 className="mb-2">Información de Pasajeros</h5>
            </div>
            {
                rulesBloqueo ?
                    (
                        <div className="col-12">
                            { order && model === 'reservation' ? 
                            <></>
                            :
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="fw-semibold text-muted pb-2" htmlFor="count-rooms">
                                        Número de Habitaciones<code>*</code>
                                    </label>

                                    <Select
                                        onValueChange={(value) => setCountRooms(Number(value))}
                                        value={countRooms.toString()}
                                    >
                                        <SelectTrigger id="count-rooms">
                                            <SelectValue placeholder="Seleccione las habitaciones"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value="0"
                                                key={`counter-room-0`}
                                                disabled={true}
                                                className="tw-opacity-60"
                                            >
                                                Seleccione una opción
                                            </SelectItem>
                                            {optionsRooms(40)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-md-6 d-flex align-items-end">
                                    <Button className="mb-1" onClick={() => setOpenModalRules(true)}>
                                        <i className="fas fa-info-circle"></i> Reglas de Pasajeros y Habitaciones
                                    </Button>
                                    <ModalRules
                                        open={openModalRules}
                                        onOpenChange={() => {
                                            setOpenModalRules(false)
                                        }}
                                    />
                                </div>
                            </div>
                            }
                            <div className="row py-5">
                                {rooms.map((room, index) => (
                                    <RoomCard
                                        key={room.id}
                                        rulesBloqueo={rulesBloqueo}
                                        onRemove={() => removeRoom(room.id)}
                                        roomNumber={index}
                                        onChangeRoom={(data) => handleRoomChange(index, data)}
                                        roomInformation={roomsInformation}
                                        uuid={uuid}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-secondary my-5">Seleccione un bloqueo</p>
                    )
            }
        </div>
    );
});

export default RoomSelector;

function optionsRooms(max_rooms: number) {
    const options = [];
    let counter = 1;

    while (counter <= max_rooms) {
        options.push(
            <SelectItem
                value={counter.toString()}
                key={`counter-room-${counter}`}
            >
                {counter}
            </SelectItem>
        );
        counter++;
    }

    return options;
}

interface RoomCardProps {
    rulesBloqueo: any;
    onRemove: () => void;
    roomNumber: number;
    onChangeRoom?: (data: RoomsToOrderInterface) => void;
    roomInformation: RoomsToOrderInterface[];
    uuid: string | null;
}

type RoomKey = 'sgl' | 'dbl' | 'tpl' | 'cpl';

function RoomCard(
    {rulesBloqueo, onRemove, roomNumber, onChangeRoom, roomInformation , uuid}: RoomCardProps
) {
    const roomsTitle = {
        sgl: 'Sencilla',
        dbl: 'Doble',
        tpl: 'Triple',
        cpl: 'Cuádruple'
    }
    const [roomType, setRoomType] = useState<RoomKey[]>([]);
    const [passengersCount, setPassengersCount] = useState<PassengerRulesCountInterface | null>(null);
    const [roomSelectedType, setRoomSelectedType] = useState<RoomKey>('dbl');
    const [minorsAges, setMinorsAges] = useState<string[]>([]);
    const [rateSelected, setRateSelected] = useState<string>('2');
    const [twinSelected, setTwinSelected] = useState<boolean | 'indeterminate'>(false);

    const [passersSelected, setPassengersSelected] = useState<{
        adt: number,
        inf: number,
        mnr: number,
    }>({
        adt: 0,
        inf: 0,
        mnr: 0,
    });

    useEffect(() => {
        if (onChangeRoom) {
            const roomInformation = {
                rate: rateSelected,
                type: roomSelectedType,
                twin: twinSelected === 'indeterminate' ? true : twinSelected,
                adt: passersSelected.adt,
                mnr: passersSelected.mnr,
                tot_infants: passersSelected.inf,
                passengers: passengersArray(),
            }

            onChangeRoom(roomInformation);
        }
    }, [passersSelected, minorsAges, roomSelectedType, twinSelected]);

    useEffect(() => {
        if(Object.keys(rulesBloqueo.rooms).length){
            setRoomType(Object.keys(rulesBloqueo.rooms) as RoomKey[]);

            const passengers_counts = getMaxCountsByRoom(rulesBloqueo.rooms);
            setPassengersCount(passengers_counts[roomSelectedType]);

            if(!(roomInformation[roomNumber] === undefined )) return;
            setPassengersSelected(
                {
                    adt: passengers_counts[roomSelectedType].adt,
                    inf: 0,
                    mnr: 0,
                }
            );

            setMinorsAges([])
        }
    }, [rulesBloqueo, roomSelectedType]);

    useEffect(() => {
        if (roomInformation &&
            roomInformation[roomNumber] &&
            uuid &&
            passersSelected.adt === 0
        ) {
            const roomData = roomInformation[roomNumber];
            setRoomSelectedType(roomData.type || 'dbl');
            setRateSelected(roomData.rate?.toString() || '2');
            setTwinSelected(roomData.twin || false);
            setPassengersSelected({
                adt: roomData.adt || 0,
                mnr: roomData.mnr || 0,
                inf: roomData.tot_infants || 0,
            });
            const dataset =
                roomData.passengers
                    ?.filter((p: any) =>
                        p.code === 'mnr1' || p.code === 'mnr2' || p.code === 'mnr3'
                    )
                    .map((p: any) =>
                        moment(p.age).format('YYYY-MM-DD'));
            setMinorsAges(dataset);
        }
    }, [roomInformation, uuid]);

    function passengersArray() {
        const passengers_array: PassengerToOrderInterface[] = [];

        for (let i = 0; i < passersSelected.adt; i++) {
            passengers_array.push({ type: 'adt', age: null, rate: rateSelected });
        }

        if (passengersCount?.age_inf) {
            for (let i = 0; i < passersSelected.inf; i++) {
                passengers_array.push({
                    type: 'inf',
                    age: moment().subtract(passengersCount.age_inf, 'y').format('YYYY-MM-DD'),
                    rate: rateSelected,
                });
            }
        }

        for (let i = 0; i < passersSelected.mnr; i++) {
            const mnr_type = evaluateMnr(minorsAges[i]);

            passengers_array.push({
                type: 'mnr',
                age: minorsAges[i],
                rate: rateSelected,
                minor_type: mnr_type,
            });
        }

        return passengers_array;
    }

    function evaluateMnr(age_date: string){
        const age_year = moment(age_date).format('YYYY');
        const today_year = moment().format('YYYY');
        const age_number = Number(today_year) - Number(age_year);

        if(passengersCount){
            for (const typeRule of passengersCount.mnr_rules) {
                const isValid = typeRule.rules.every((rule:{sign: string, value: number}) => {
                    const val = Number(rule.value);
                    if (rule.sign === '>') return age_number > val;
                    if (rule.sign === ">=") return age_number >= val;
                    if (rule.sign === "<") return age_number < val;
                    if (rule.sign === "<=") return age_number <= val;
                    return false;
                });

                if (isValid) {
                    return typeRule.type;
                }
            }
        }

        return 'mmr'
    }

    function changeMonthAndDay(
        fechaOriginal: string,
        fechaBase: string
    ): string {
        const original = new Date(fechaOriginal + "T00:00:00Z");
        const base = new Date(fechaBase + "T00:00:00Z");

        original.setUTCMonth(base.getUTCMonth());
        original.setUTCDate(base.getUTCDate());

        const year = original.getUTCFullYear();
        const month = String(original.getUTCMonth() + 1).padStart(2, '0');
        const day = String(original.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    return (
        <div className="div-info col-md-12 my-4">
            <div className="room_header row">
                <div className="col-md-2 d-flex align-items-center">
                    <RadioGroup className="tw-inline tw-p-[5px]" size="lg" value={rateSelected} onValueChange={setRateSelected}>
                        <RadioGroupItem value={'2'}  variants="warning"/>
                        <Label className="form-check-label !tw-text-white !tw-font-semibold !tw-opacity-100 !tw-ms-3 mb-2" data-name="terrestre"
                               htmlFor={`room-check-ground-${roomNumber}`}>
                            Terrestre
                        </Label>
                    </RadioGroup>
                </div>

                <div className="col-md-4 d-flex align-items-center">
                    <Label htmlFor="room_type_3" className="!tw-font-semibold !tw-text-white !tw-opacity-100 mb-0">Tipo de Habitación</Label>
                    <Select
                        value={roomSelectedType}
                        onValueChange={(value: RoomKey) => (
                            setRoomSelectedType(value),
                            setPassengersSelected(prev => ({
                                ...prev,
                                adt: 1
                            }))
                        )}
                    >
                        <SelectTrigger
                            defaultValue={'dbl'}
                            id={`room_${roomNumber}_type`}
                            className="tw-w-[100px] tw-inline tw-text-[12px] p-1"
                            size="sm"
                        >
                            <SelectValue placeholder=""/>
                        </SelectTrigger>
                        <SelectContent>
                            {
                                roomType.map(type => (
                                    <SelectItem value={type} key={`room_${roomNumber}_type_select_${type}`} >
                                        {roomsTitle[type as keyof typeof roomsTitle]}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-md-3 align-self-center">
                    <div className={ roomSelectedType === 'dbl' ? 'w-100 d-flex align-items-center' : 'd-none'}>
                        <Checkbox id={`room-check-twin-${roomNumber}`} checked={twinSelected} size="lg" variant="warning" onCheckedChange={setTwinSelected}/>
                        <Label htmlFor={`room-check-twin-${roomNumber}`} className="!tw-ms-3 !tw-text-white !tw-font-semibold !tw-opacity-100  mb-0">Habitación Twin</Label>
                    </div>
                </div>

                <div className="col-md-3 d-flex justify-content-end number align-items-center">
                    Habitación {roomNumber + 1}
                    <Button variant="destructive" mode="icon" onClick={onRemove} className="ms-4" size="sm">
                        <i className="fas fa-trash-can btn-del float-end p-0"></i>
                    </Button>
                </div>
            </div>
            <div className="form-group group-adults">
                <div className="tw-grid">
                    <div className="tw-grid">
                        <Label htmlFor={`room-${roomNumber}-select-adt`}>Adultos</Label>
                        <Select
                            value={String(passersSelected.adt)}
                            onValueChange={(value) => {
                                setPassengersSelected((prev) => ({...prev, adt: Number(value)}));
                            }}
                        >
                            <SelectTrigger
                                id={`room-${roomNumber}-select-adt`}
                                className="tw-w-[70px] tw-inline-grid tw-text-[12px] p-1"
                                size="sm"
                            >
                                <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: passengersCount?.adt ?? 1 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>
                                        {i + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="form-group group-minors">
                <div className="tw-inline-table">
                    <div className="tw-grid">
                        <Label htmlFor={`room-${roomNumber}-select-mnr`} data-label="minors">Menores</Label>
                        <Select
                            value={String(passersSelected.mnr)}
                            onValueChange={(value) => {
                                const count = Number(value);
                                setPassengersSelected((prev) => ({ ...prev, mnr: count }));
                                setMinorsAges(Array(count).fill(moment().subtract(passengersCount?.mnr.min_age ?? 2, 'y').format('YYYY-MM-DD')));
                            }}
                        >
                            <SelectTrigger
                                id={`room-${roomNumber}-select-adt`}
                                className="tw-w-[70px] tw-inline-grid tw-text-[12px] p-1"
                                size="sm"
                            >
                                <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: passengersCount?.mnr.count ?? 1 }, (_, i) => (
                                    <SelectItem key={i} value={String(i)}>
                                        {String(i)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {Array.from({length: passersSelected.mnr}, (_, i) => (
                    <div className="tw-inline-table ms-3" key={`room_${roomNumber}_menor_${i}_div_age`}>
                        <div className="tw-grid">
                            <Label htmlFor={`room_${roomNumber}_mnr_${i}_rate`}>Menor {i + 1}</Label>
                            <Select
                                value={minorsAges[i] ?? ''}
                                onValueChange={(value) => {
                                    setMinorsAges((prev) => {
                                        const updated = [...prev];
                                        updated[i] = value;
                                        return updated;
                                    });
                                }}
                            >
                                <SelectTrigger
                                    className="tw-w-[70px] tw-inline-grid tw-text-[12px] p-1"
                                    size="sm"
                                    id={`room_${roomNumber}_mnr_${i}_rate`}
                                >
                                    <SelectValue placeholder={'Edad'}></SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: passengersCount?.mnr.max_age ?? 1}, (_, i_2) => {
                                        if (passengersCount?.mnr.min_age && i_2 >= passengersCount.mnr.min_age) {
                                            return (
                                                <SelectItem
                                                    value={changeMonthAndDay(
                                                        moment().subtract(i_2, 'y').format('YYYY-MM-DD'),
                                                        minorsAges[i]
                                                    )}
                                                    key={`room_${roomNumber}_menor_${i}_div_age_item_${i_2}`}
                                                >
                                                    {String(i_2)}
                                                </SelectItem>
                                            );
                                        }
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-group group-infants">
                <div className="tw-grid">
                    <Label htmlFor={`room-${roomNumber}-select-inf`}>Infantes</Label>
                    <Select
                        value={String(passersSelected.inf)}
                        onValueChange={(value) => {
                            setPassengersSelected((prev) => ({...prev, inf: Number(value)}));
                        }}
                    >
                        <SelectTrigger
                            id={`room-${roomNumber}-select-inf`}
                            className="tw-w-[70px] tw-inline-grid tw-text-[12px] p-1"
                            size="sm"
                        >
                            <SelectValue></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({length: passengersCount?.inf ?? 1}, (_, i) => (
                                <SelectItem key={i} value={String(i)}>
                                    {String(i)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
