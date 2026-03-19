
interface RulesBloqueoInterface {
    bloqueo: BloqueoInterface;
    passengers_types: PassengerTypeInterface[];
    rate_types: RateTypeInterface[];
    rates: RateInterface[];
    rooms: RoomRuleInterface[];
}

interface RoomRuleInterface {
    [key: string]: PassengerTypeInfoInterface;
}

interface PassengerTypeInfoInterface {
    [key: string]: PassengerInformationInterface;
}

interface PassengerInformationInterface {
    count: number;
    rules: PassengerRuleInterface[];
}

interface PassengerRuleInterface {
    sign: string;
    valid_date: Date;
    value: number
}

interface RateInterface {
    name: string;
    type: string;
    rooms: RoomTypeInterface[];
}

interface RoomTypeInterface {
    code: string;
    name: string;
}

interface PassengerTypeInterface {
    code: string;
    name: string;
    rules: PassengerRuleInterface[];
}

interface RateTypeInterface {
    code: string;
    id: number;
    name: string;
}

interface CurrencyInterface {
    name: string;
    code: string;
}

interface DestinationInterface {
    uid: string;
    name: string;
}

interface MtsInterface {
    clv: string;
    name: string;
    tours: TourInterface[];
    operators: [];
    is_exa: boolean;
}

interface StatusInterface {
    name: string;
    id: number;
}

interface BloqueoInterface {
    blq: string;
    currency: CurrencyInterface;
    departured_at: Date;
    destination: DestinationInterface;
    destination_id: number;
    emited_at: Date;
    mts: MtsInterface;
    name: string;
    online_at: Date;
    return_at: Date;
    status: StatusInterface;
    uid: string;
    program: ProgramInterface;
    departure_at: string;
    edit_information_ground_at: string;
}

interface TourInterface {
    uid: string;
    name: string;
    description: string;
    operator_id: number;
    price: string;
    price_net: number;
    is_mnr: number;
    is_refundable: boolean;
    show_web: number;
    online: boolean;
    tour_rates_same_currency: TourRateSameCurrency[];
    expire_at: Date;
    start_vigency: Date;
}

interface TourOrderInterface{
    uid?: string;
    selected?: boolean | undefined;
    quantity: number;
    tour: TourInterface;
    code: "adt" | "mnr1" | "mnr2" | "mnr3" | "mnr";
    price: string;
}

interface RoomsToOrderInterface {
    rate: string;
    type: 'sgl' | 'dbl' | 'tpl' | 'cpl';
    twin: boolean;
    adt: number;
    mnr: number;
    passengers: PassengerToOrderInterface[];
    tot_infants: number;
}

interface PassengerToOrderInterface {
    type: string;
    age: string | undefined | null;
    rate: string;
    minor_type?: string;
    birthday?: string;
    commission?: string;
    name?: string;
    passenger_sequence?: number;
    price?: string;
    suplements?: SuplementsInterface[];
    sequence?: number;
    tax?: string;
    code?: string;
    uid?: string;
    information: PassengerInterface;
    additionals: ServicesReservationInterface;
}

interface PassengerInterface {
    birthday?: string;
    email?: string;
    first_last_name: string;
    first_name: string;
    gender?: string;
    main?: boolean;
    middle_name: string;
    notes?: string;
    passport?: string;
    passport_expire_at?: string;
    passport_status?: number;
    passport_url?: string;
    phone?: string;
    second_last_name: string;
    title?: string;
    type?: string;
    uid: string;
    nationality?: NacionalityInterface;
    progress?: number;
    code?: string;
    progres: number;
}

interface TourRateSameCurrency {
    code: "adt" | "mnr1" | "mnr2" | "mnr3" | "mnr";
    currency: CurrencyInterface;
    price: string;
    price_net: string;
}

interface RoomPaxInterface {
    adt: number;
    inf: number;
    mnr: number;
    tot_mnr: {
        mnr1: number;
        mnr2: number;
        mnr3: number;
        mnr?: number;
        adt?: number;
    }
}

interface ProgramInterface {
    clv: string;
    countries: string;
    exa: boolean;
    name: string;
}

interface PassportInterface{
    passport?: string;
    passport_expire_at?: string;
    passport_status?: number;
    passport_url?: string;
    first_last_name?: string;
    first_name?: string;
    gender?: string;
    middle_name?: string;
    second_last_name?: string;
    birthday?: string;
}

interface PassportPromiseInterface{
    expire: string;
    number: string;
    passenger?: PassengerInterface;
    passport: string;
    passport_info?: [];
    uid: string;
}

interface SuplementsInterface{
    name: string;
    price: string;
}

interface NacionalityInterface{
    code: string;
    name: string;
    region: string;
}
