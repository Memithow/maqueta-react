import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import useOrder from "../hooks/useOrder";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface ModalRulesProps {
    open: boolean;
    onOpenChange: () => void;
}

export default function ModalRules({
    open,
    onOpenChange,
}: ModalRulesProps) {
    const [psg, setPsg] = useState<{ [key: string]: RulesPsgInterface[] }>({});
    const [rooms, setRooms] = useState<string[]>([]);
    const [room, setRoom] = useState<string>('dbl');
    const { rulesBloqueo } = useOrder();

    if(!rulesBloqueo) return;

    const ComparisonArray = [
        { name: "Menor a", code: "<" },
        { name: "Mayor a", code: ">" },
        { name: "Menor o igual a", code: "<=" },
        { name: "Mayor o igual a", code: ">=" },
        { name: "Igual a", code: "=" },
    ];

    const labelsRooms: { [key: string]: string } = {
        "sgl": "Sencilla",
        "dbl": "Doble",
        "tpl": "Triple",
        "cpl": "Cuádruple",
    }

    function columnAge(code: string) {
        let text_ = ComparisonArray.find(s => s.code === psg[code][0].sign);
        if (psg[code].length > 1) {
            let _text = ComparisonArray.find(s => s.code === psg[code][1].sign)
            return text_?.name + ' ' + psg[code][0].value + ' y ' + _text?.name + ' ' + psg[code][1].value;
        }
        return text_?.name + ' ' + psg[code][0].value;;
    }

    function tableRulesRoom() {
        let valueHeader = 0;
        let valueColumns: { [key: number]: string[] } = {};
        // @ts-ignore
        let _room: { [key: string]: PassengerTypeInfoInterface[] } = { ...rulesBloqueo.rooms };

        if (!_room[room]) {
            return <div className="d-flex justify-content-center p-2 fs-3 fw-bold text-muted">
                {Object.keys(psg).length > 0 ? 'Selecciona una habitación' : 'No hay datos disponibles'}
            </div>
        }
        _room[room].forEach((rule, index) => {
            let value = 0;
            valueColumns[index] = [];
            Object.entries(rule).forEach(([key_, code]) => {
                value = value + code.count
                for (let i = 0; i < code.count; i++) {
                    valueColumns[index].push(key_)
                }
            })
            if (valueHeader > value) return;
            valueHeader = value;
        })

        return <table className="table table-sm table-hover rounded mb-0 fs-5">
            <thead>
                <tr>
                    {
                        Array.from({ length: valueHeader }).map((_, index) => (
                            <th key={`room_rule_th_${uuidv4()}`} className="fw-bold">Pasajero {index + 1}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    Object.keys(valueColumns).map(rule => (
                        <tr key={`room_rule_tr_${uuidv4()}`}>
                            {
                                valueColumns[parseInt(rule)].map((code, index) => (
                                    <td key={`room_rule_td_${uuidv4()} `}>
                                        {code.toUpperCase()}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    }

    useEffect(() => {
        setPsg({});
        setRooms([]);

        if (rulesBloqueo?.passengers_types?.length === 0 ||
            !open
        )
            return;

        setPsg((_psg) => {
            let psg_array: { [key: string]: [] } = {};
            setRooms((rooms) => {
                let rooms_ = [...rooms];
                Object.entries(rulesBloqueo.rooms).forEach(([key, room]) => {
                    if (!rooms_.includes(key)) {
                        rooms_.push(key);
                    }
                    // @ts-ignore
                    room.forEach((rule) => {
                        Object.entries(rule).forEach(([code, rulesPsg]) => {
                            if (!psg_array[code]) { // @ts-ignore
                                psg_array[code] = rulesPsg.rules;
                            }
                        });
                    });
                });
                return rooms_;
            })
            return psg_array;
        });
    }, [rulesBloqueo, open]);

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Reglas de pasajeros y habitaciones
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        <div className="mb-3 p4">
                            Reglas de pasajeros y acomodos permitidos por
                            habitación
                            <br />
                            Salida: 16300-151 - Europa Clásica
                        </div>
                        <div className="callout callout-warning text-black">
                            El menor debe cumplir con la edad requerida al
                            término del programa.
                        </div>
                        <div className="table-responsive-md">
                            <table className="table table-sm table-hover rounded mb-0 fs-5">
                                <thead className="bg-primary text-white font-bold">
                                    <tr>
                                        <th className="p-2">
                                            Tipo de pasajero
                                        </th>
                                        <th className="p-2">Edad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(psg).length > 0 ? (
                                        rulesBloqueo.passengers_types.map(
                                            (psg) => (
                                                <tr key={`pax_${uuidv4()}`}>
                                                    <td className="p-2">
                                                        {psg.name} ({psg.code.toUpperCase()})
                                                    </td>
                                                    <td className="p-2">
                                                        {columnAge(psg.code)}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-center fs-3 fw-bold text-muted">
                                                No hay datos disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <br />
                            <div className="w-100 p-2 text-white tw-text-xl tw-font-semibold d-flex bg-primary justify-content-center">
                                Acomodos Permitidos
                            </div>
                            {rooms.length > 0 &&
                                rooms.map(_room => (
                                    <Button
                                        key={`room_tab_${uuidv4()}`}
                                        type="button"
                                        variant="secondarytwo"
                                        className={_room === room ? 'border-bottom border-2 border-success' : ''}
                                        onClick={() => setRoom(_room)}
                                    >
                                        {labelsRooms[_room]}
                                    </Button>
                                ))
                            }
                            {tableRulesRoom()}
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="d-flex justify-content-end p-2 mb-2">
                        <Button variant='outline' onClick={onOpenChange}>
                            Cerrar ventana
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
