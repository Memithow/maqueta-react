
interface CustomerInterface {
    black_list: boolean;
    cid_customer: string;
    commision: string;
    id: string;
    model: string;
    name: string;
    phone: string;
    social_reazon: string;
    status: string;
    type_account?: string;
}

interface AgentInterface {
    cid_funcionario: string;     
    email: string; 
    first_lastname: string;
    id: string;
    name: string;
    names: string;
    phone: string;
    second_lastname: string;
    status: string;
    status_name: string;
    cc_email: string | null;
}
