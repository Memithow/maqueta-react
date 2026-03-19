import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useOrder from "../hooks/useOrder";
import { toast } from "sonner"

interface OrderActionsInterface {
    setModal: (b: boolean) => void;
    setCancelation: (b: boolean) => void;
}

export function OrderActions({ setModal, setCancelation }: OrderActionsInterface) {
    const { order } = useOrder();
    const url = window.location.href;

    function print() {
        try {
            window.open(`${url}/print`, '_blank')
        } catch (e) {
            toast.error('No se pudo abrir el archivo');
            console.error(e)
        }
    }

    function pdf() {
        try {
            window.open(`${url}/pdf`, '_blank')
        } catch (e) {
            toast.error('No se pudo abrir el archivo');
            console.error(e)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="p-2">
                    <div className="tw-flex-col">
                        <i className="fa fa-cog w-100 fs-4"></i>
                        <i className="bi bi-chevron-down w-100 fs-4"></i>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="px-3">
                <DropdownMenuItem onClick={() => setModal(true)} className="px-3 text-gray-700 py-2">
                    <i className="fa fa-envelope me-3 text-primary fs-4"></i>
                    Enviar Reservación
                </DropdownMenuItem>
                <DropdownMenuItem onClick={print} className="px-3 text-gray-700 py-2">
                    <i className="fa fa-print me-3 text-gray-700 fs-4"></i>
                    Reservación Imprimible
                </DropdownMenuItem>
                <DropdownMenuItem onClick={pdf} className="px-3 text-danger py-2" >
                    <i className="fa fa-file-pdf me-3 text-danger fs-4"></i>
                    Descargar PDF
                </DropdownMenuItem>
                {order?.request_cancelation === false ?
                    <DropdownMenuItem onClick={()=> setCancelation(true)} className="px-3 text-danger py-2" >
                        <i className="fa fa-times me-3 text-danger fs-4"></i>
                        Solicitar Cancelación
                    </DropdownMenuItem>
                    :
                    <DropdownMenuItem onClick={()=> setCancelation(true)} className="px-3 text-danger py-2" >
                        <i className="fa fa-times me-3 text-danger fs-4"></i>
                        Cancelar Solicitud
                    </DropdownMenuItem>
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}