interface BloqueoSearchInterface{
    id: string;
    text: string;
}

interface RulesPsgInterface {
    sign: string;
    value: number;
    verify: number;
}

interface Passenger {
  type: string;
  age: number | null;
  rate: string;
}

interface Room {
  rate: string;
  type: string;
  twin: string;
  adt: string;
  passengers: Passenger[];
  mnr: string;
  tot_infants: string;
}

interface Tour {
  uid: string;
  code: string;
  pax: string;
}

interface QuoteInterface {
  only_ground: string;
  buid: string;
  bloqueo_uid: string;
  cid_quote_ref: string | null;
  uid: string;
  customer_model: string;
  customer_mc: string;
  customer_contact_name: string | null;
  customer_contact_mail: string | null;
  customer_contact_phone: string;
  customer_contact_cc: string | null;
  quote_contact_way_id: string;
  customer_fn: string;
  agency_contact_way_id: string;
  megamail_proposition: string | null;
  megamail_good_idea: string | null;
  megamail_suits: string | null;
  megamail_requirements: string | null;
  observations: string | null;
  intern_observations: string | null;
  rooms: Room[];
  tours: Tour[];
}
