import { createContext, type Dispatch, type SetStateAction } from 'react';


interface OrderContextInterface {
    customer: CustomerInterface | undefined;
    setCustomer: Dispatch<SetStateAction<CustomerInterface | undefined>>;

    agent: AgentInterface | undefined;
    setAgent: Dispatch<SetStateAction<AgentInterface | undefined>>;

    description: string;
    setDescription: Dispatch<SetStateAction<string>>;

    cc_email: string;
    setCc_mail: Dispatch<SetStateAction<string>>;

    selectTours: TourOrderInterface[];
    setSelectTours: Dispatch<SetStateAction<TourOrderInterface[]>>;

    psgPax: RoomPaxInterface | undefined;
    setPsgPax: Dispatch<SetStateAction<RoomPaxInterface | undefined>>;

    rulesBloqueo: RulesBloqueoInterface | null;
    setRulesBloqueo: Dispatch<SetStateAction<RulesBloqueoInterface | null>>;

    selectedBloqueo: BloqueoSearchInterface | null;
    setSelectedBloqueo: Dispatch<SetStateAction<BloqueoSearchInterface | null>>;

    model: string;
    editPermissions: boolean;

    // Rooms
    countRooms: number;
    setCountRooms: Dispatch<SetStateAction<number>>;

    roomsInformation: RoomsToOrderInterface[];
    setRoomsInformation: Dispatch<SetStateAction<RoomsToOrderInterface[]>>;

    // Edit
    uuid: string | null;

    // Reservation
    order: OrderInterface | undefined;
    setOrder: Dispatch<SetStateAction<OrderInterface | undefined>>;
}

export const OrderContext = createContext<OrderContextInterface | null>(null);
