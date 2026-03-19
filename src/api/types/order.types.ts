interface OrderInterface {
    bloqueo: BloqueoInterface;
    count_passengers: number;
    count_rooms: number;

    created_at: string;
    updated_at: string;

    customer_contact_mail: string;
    customer_fn: string;
    customer_mc: string;
    customer_name: string;

    model: string;
    expedient?: string;
    observations: string;
    online: boolean;

    order: OrderReservationInterface;

    reserved?: boolean;
    reserved_at?: string;

    rooms: RoomReservationInterface[];

    registered_expedient_at?: string | null;
    registered_lax_at?: string | null;
    request_cancelation?: boolean;

    sended: boolean;
    sended_at: string;
    sended_whatsapp: boolean;
    sended_whatsapp_at: string | null;

    services?: ServicesReservationInterface;
    cancel_reason?: string;

    source: string[];
    status: StatusInterface;
    uid: string;
}

interface RoomReservationInterface {
    code: 'sgl' | 'dbl' | 'tpl' | 'cpl';
    name: string;
    room_sequence?: number;
    twin: boolean;
    passengers: PassengerToOrderInterface[];
    adt: number,
    mnr: number,
    tot_infants: number,
    rate: string,
    type: 'sgl' | 'dbl' | 'tpl' | 'cpl';
}

interface OrderReservationInterface {
    commissions?: {
        package: number;
    }
    details: {};
    currency?: CurrencyInterface;
    payment?: number;
    total?: number;
    services?: ServicesReservationInterface;
}

interface ServicesReservationInterface {
    tours: TourOrderInterface[];
    extras?: ExtraInterface[];
    integrated_services?: IntegratedServicesIterface[];
    insurances?: InsurancesInterface[];
    products?: ProductInterface[];
    extra_nights?: {
        pos?: ExtraNightInterface;
        pre?: ExtraNightInterface;
    };
}

interface ExtraInterface {
    created: string;
    description: string;
    quantity: number;
    price: string;
    uid: string;
}

interface IntegratedServicesIterface {
    created_at: string;
    description: string | undefined;
    name: string;
    price: number;
    uid: string;
    updated_at: string;
}

interface InsurancesInterface {
    addon: number;
    addon_price_day: number;
    addon_price_travel: number;
    currency: string;
    days: number;
    id_insurance: number;
    insurer: string;
    is_elderly: number;
    name: string;
    price_day: number;
    rate_exchange: number;
    total: number;
    uid: string;
}

interface ProductInterface {
    passenger: PassengerToOrderInterface | null;
    price: number;
    product_name: string;
    product_uid: string;
    reservation_room: number | undefined;
    room_sequence: number | undefined;
    service_type: string;
    uid_product_order: string;
    quantity: number;
}

interface ExtraNightInterface {
    nights: number;
    quantity: number;
    rate: string;
    operator: OperatorExtraNight;
}

interface OperatorExtraNight {
    id: string;
    name: string;
}
