import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogBody,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input, InputAddon, InputGroup } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomersClient from "@/api/services/CustomersClient";
import DataTableAjax from "@/components/ui/table-ajax";
import ComponentLoader from "@/components/common/component-loader";
import { toast } from "sonner"
import useOrder from "../hooks/useOrder";

interface ClientsModalInterface {
    open: boolean;
    onOpenChange: () => void;
}

export default function ClientsModal({
    open,
    onOpenChange,
}: ClientsModalInterface) {
    const customersClient = new CustomersClient();
    const [customers, setCustomers] = useState<CustomerInterface[]>([]);
    const [querySearch, setQuerySearch] = useState<string>("");
    const [querySearchAgents, setQuerySearchAgents] = useState<string>();
    const [agents, setAgents] = useState<AgentInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { customer, setAgent, setCustomer, order } = useOrder();

    async function getClients() {
        try {
            setLoading(true);
            setAgents([]);
            setQuerySearchAgents(undefined);
            const data = await customersClient.getClients(querySearch);
            if (data) setCustomers(data);
        } catch (e) {
            toast.error(String(e));
        } finally {
            setLoading(false);
        }
    }

    async function getAgents() {
        setAgents([]);
        if (!customer) return;
        try {
            setLoading(true);
            const data = await customersClient.getClientAgents(
                customer.cid_customer,
                querySearchAgents ?? ""
            );
            if (data) setAgents(data);
        } catch (e) {
            toast.error(String(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open) return;
        setQuerySearch("");
        getClients();
    }, [open]);

    useEffect(() => {
        if (!customer || order) return;
        getAgents();
    }, [customer]);

    const columnsCostumers = [
        { key: "cid_customer", label: "MC" },
        { key: "name", label: "Nombre" },
        {
            key: "actions",
            label: "",
            render: (item: any) => (
                <div className="d-flex justify-content-end">
                    <Button
                        size="icon"
                        variant="success"
                        onClick={() => (
                            setQuerySearchAgents(""), setCustomer(item)
                        )}
                    >
                        <ChevronRight className="p-1" />
                    </Button>
                </div>
            ),
        },
    ];

    const columnsAgents = [
        { key: "cid_funcionario", label: "Clave" },
        { key: "name", label: "Nombre" },
        { key: "email", label: "Email" },
        {
            key: "actions",
            label: "",
            render: (item: any) => (
                <div className="d-flex justify-content-end">
                    <Button
                        size="icon"
                        variant="success"
                        onClick={() => (setAgent(item), onOpenChange())}
                    >
                        <CheckIcon className="p-1" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Consulta de clientes</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {loading && ComponentLoader()}
                    <div className="fs-4 row g-3">
                        <div className="col-12 col-lg-6">
                            <Label>Listado de agencias</Label>
                            <div className="mt-3">
                                <InputGroup>
                                    <Input
                                        value={querySearch}
                                        onChange={(e) =>
                                            setQuerySearch(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && getClients()
                                        }
                                    />
                                    <InputAddon
                                        className="hover:tw-bg-primary tw-cursor-pointer hover:tw-text-white"
                                        onClick={getClients}
                                    >
                                        <Search />
                                    </InputAddon>
                                </InputGroup>
                            </div>
                            <DataTableAjax
                                data={customers}
                                columns={columnsCostumers}
                                itemsPerPage={10}
                            />
                        </div>
                        {agents.length > 0 ||
                            querySearchAgents !== undefined ? (
                            <div className="col-12 col-lg-6 mt-3">
                                <Label>Funcionarios de agencia</Label>
                                <br />
                                <small className="mt-2">
                                    {" "}
                                    {customer?.cid_customer +
                                        " " +
                                        customer?.name}{" "}
                                </small>
                                <div className="mt-3">
                                    <InputGroup>
                                        <Input
                                            value={querySearchAgents ?? ""}
                                            variant="md"
                                            onChange={(e) =>
                                                setQuerySearchAgents(
                                                    e.target.value ?? " "
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                customer &&
                                                getAgents()
                                            }
                                        />
                                        <InputAddon
                                            className="hover:tw-bg-primary tw-cursor-pointer hover:tw-text-white"
                                            onClick={() => {
                                                customer && getAgents();
                                            }}
                                        >
                                            <Search />
                                        </InputAddon>
                                    </InputGroup>
                                </div>
                                <DataTableAjax
                                    data={agents}
                                    columns={columnsAgents}
                                    itemsPerPage={10}
                                />
                            </div>
                        ) : (
                            <div
                                className="col-12 col-lg-6 d-flex align-items-center justify-content-center text-center text-secondary mt-4"
                                style={{ height: "200px", padding: "6rem" }}
                            >
                                Selecciona la agencia para continuar y mostrar
                                los funcionarios
                            </div>
                        )}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="w-100 p-4 d-flex justify-content-end">
                        <Button variant="outline" onClick={onOpenChange}>
                            Cancelar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
