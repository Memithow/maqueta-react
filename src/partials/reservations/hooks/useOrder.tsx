import { toast } from "sonner"
import { useContext } from "react";
import { OrderContext } from '@/partials/reservations/context/OrderContext.tsx';

export default function useOrder() {
    const context = useContext(OrderContext);

    if (!context) {
        toast.error("OrderContext no esta disponible");
        throw new Error("OrderContext no esta disponible");
    }

    return context;
}