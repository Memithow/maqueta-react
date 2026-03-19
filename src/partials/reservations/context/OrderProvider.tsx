import { useState } from "react";
import { OrderContext } from "./OrderContext.tsx";

interface ChildrenInterface{
    children: React.ReactNode;
    model: string;
}

export function OrderProvider({ children, model }: ChildrenInterface ) {

    const [ customer, setCustomer ] = useState<CustomerInterface>();
    const [ agent, setAgent ] = useState<AgentInterface>();
    const [description, setDescription] = useState<string>("");
    const [cc_email, setCc_mail] = useState<string>('');
    const [selectTours, setSelectTours] = useState<TourOrderInterface[]>([]);
    const [psgPax, setPsgPax] = useState<RoomPaxInterface>();
    const [rulesBloqueo, setRulesBloqueo] =
        useState<RulesBloqueoInterface | null>(null);

    const [countRooms, setCountRooms] = useState<number>(0);
    const [roomsInformation, setRoomsInformation] = useState<
        RoomsToOrderInterface[]
    >([]);
    const [selectedBloqueo, setSelectedBloqueo] =
        useState<BloqueoSearchInterface | null>(null);

    let uuid = null;

    if ( model && model === 'reservation' ){
        uuid = document.getElementById('order-reservation-show')?.dataset.uid ?? null;
    }else if (model === 'quote' ){
        uuid = document.getElementById('order-create')?.dataset.uid ?? null;
    }

    const [order, setOrder] = useState<OrderInterface>();

    let editPermissions = false;
    if(order){
        editPermissions = new Date() <= new Date(order.bloqueo.edit_information_ground_at)
    }

    return (
        <OrderContext.Provider value={{
            uuid,
            customer,
            setCustomer,
            agent,
            setAgent,
            description,
            setDescription,
            cc_email,
            setCc_mail,
            selectTours,
            setSelectTours,
            psgPax,
            setPsgPax,
            rulesBloqueo,
            setRulesBloqueo,
            countRooms,
            setCountRooms,
            roomsInformation,
            setRoomsInformation,
            selectedBloqueo,
            setSelectedBloqueo,
            order,
            setOrder,
            model,
            editPermissions,
        }}>
            { children }
        </OrderContext.Provider>
    )
}