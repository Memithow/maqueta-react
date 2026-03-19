import { useState } from "react";
import { Input, InputGroup, InputAddon } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import ClientsModal from "./clients-modal";
import useOrder from "../hooks/useOrder";

export default function ClientInfo() {
    const [openModalClients, setOpenModalClients] = useState<boolean>(false);
    const { customer, agent, cc_email, setCc_mail } = useOrder();
    const stylesC = {
        divInput: 'mt-2 mb-3',
        inputCustomer: '',
        smallCustomer: 'fs-6'
    }

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="fs-5 mb-4">Información de cliente</div>
                <div className="row tw-text-muted-foreground">
                    <div className="col-12 col-md-6 mb-3">
                        <Label>Agencia de viajes</Label> <code>*</code>
                        <div className={stylesC.divInput}>
                            <InputGroup>
                                <Input
                                    variant="md"
                                    disabled={true}
                                    placeholder="Nombre del Cliente"
                                    value={
                                        (customer && agent) ? customer.name : ""
                                    }
                                    className={stylesC.inputCustomer}
                                />
                                <InputAddon
                                    variant="md"
                                    onClick={() => setOpenModalClients(true)}
                                >
                                    <Search />
                                </InputAddon>
                            </InputGroup>
                        </div>
                        <small className={stylesC.smallCustomer}>
                            Utiliza la herramienta para encontrar o registrar a
                            tu cliente
                        </small>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                        <Label className="fs-5">Número de cliente (MC)</Label>{" "}
                        <code>*</code>
                        <div className={stylesC.divInput}>
                            <Input
                                variant="md"
                                disabled={true}
                                placeholder="Número del Cliente"
                                value={
                                    (customer && agent)
                                        ? customer.cid_customer
                                        : ""
                                }
                            />
                            <small className="fw-bold fs-6 badge badge-light-success">
                                <i className="fa fa-circle-user pe-2">
                                </i>
                                {(customer && agent)
                                    ? customer.cid_customer
                                    : ""}
                            </small>
                        </div>
                        <small className={stylesC.smallCustomer}>
                            Clave de agencia registrada en LAX
                        </small>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                        <Label className="fs-5">Funcionario</Label>{" "}
                        <code>*</code>
                        <div className={stylesC.divInput}>
                            <Input
                                variant="md"
                                disabled={true}
                                placeholder="Nombre del Cliente"
                                value={agent ? agent.name : ""}
                                className={stylesC.inputCustomer}
                            />
                        </div>
                        <small className={stylesC.smallCustomer}>
                            Agente de contacto a quien se le enviará la
                            cotización
                        </small>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                        <Label className="fs-5">Correo de contacto</Label>{" "}
                        <code>*</code>
                        <div className={stylesC.divInput}>
                            <Input
                                variant="md"
                                disabled={true}
                                placeholder="usuario@empresa.com"
                                value={agent ? agent.email : ""}
                                className={stylesC.inputCustomer}
                            />
                        </div>
                        <small className={stylesC.smallCustomer}>
                            Este correo se utilizará como medio principal de
                            contacto
                        </small>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                        <Label className="fs-5">Teléfono de contacto</Label>
                        <div className={stylesC.divInput}>
                            <Input
                                variant="md"
                                disabled={true}
                                placeholder="Teléfono"
                                value={agent ? agent.phone : ""}
                                className={stylesC.inputCustomer}
                            />
                        </div>
                        <small className={stylesC.smallCustomer}>
                            Contacto alternativo por teléfono
                        </small>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                        <Label className="fs-5">Con copia a</Label>
                        <div className="mt-2 mb-3">
                            <Input
                                value={cc_email}
                                onChange={(e) => setCc_mail(e.target.value)}
                                variant="md"
                                placeholder="usuario@empresa.com;usuario@empresa.com"
                            />
                        </div>
                        <small className="fs-6">
                            Puedes enviar tu cotización con copia a otros
                            correos separando cada email con ';' sin espacio
                            entre ellos
                        </small>
                    </div>
                </div>
            </div>

            <ClientsModal
                onOpenChange={() => setOpenModalClients(false)}
                open={openModalClients}
            />
        </div>
    );
}
