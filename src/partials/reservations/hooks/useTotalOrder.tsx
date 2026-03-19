import useOrder from "./useOrder";
import useInitOrder from "../providers/useOrder.tsx";

export function useTotalOrder() {
    const { order, model, selectTours } = useOrder();
    const {initOrder} = useInitOrder();

    // Venta libre
    let total_free_sale = 0.00;
    if (order?.order.services?.extras) {
        order.order.services.extras.map(e => {
            total_free_sale += (Number(e.price) * Number(e.quantity))
        })
    }

    // Tours opcionales
    let total_tours = 0.00;
    if (order?.order.services?.tours) {
        order.order.services.tours.map(t => {
            total_tours += ((Number(t.price) ?? 0) * Number(t.quantity))
        })
    }

    let toursChange = selectTours.reduce((tt, tour) => {
        return tt += ((Number(tour.price) ?? 0) * Number(tour.quantity))
    },0);

    if(toursChange !== total_tours) initOrder();
    
    // Servicios Integrados
    let total_portuarios = 0.00;
    if (order?.order.services?.integrated_services) {
        const services = order.order.services.integrated_services.reduce(
            (groups: { [key: string]: IntegratedServicesIterface[] }, s) => {
                const uuid = s.uid;
                if (!groups[uuid]) groups[uuid] = [];
                groups[uuid].push(s);
                return groups
            }, {});

        Object.entries(services).map(([key, serv]) => {
            total_portuarios += (Number(serv[0].price) * serv.length)
        })
    }

    //Seguros
    let total_insurances = 0;
    if (order?.order.services?.insurances && order.order.services.insurances.length > 0) {
        const departured_at = new Date(order.bloqueo.departure_at); // "YYYY-MM-DD"
        const returned_at = new Date(order.bloqueo.return_at);

        const diffTime = returned_at.getTime() - departured_at.getTime();
        const total_travel_days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        order.order.services.insurances.forEach((insurance) => {
            total_insurances +=
                (total_travel_days *
                    ((Number(insurance.price_day) || 0) +
                        (Number(insurance.addon_price_day) || 0))) +
                (Number(insurance.addon_price_travel) || 0);
        });
    }

    // Productos
    let total_products = 0;
    if (order?.order.services?.products && order.order.services.products.length > 0) {
        if (model === "reservation") {
            // Agrupar
            const products = order.order.services.products.reduce(
                (groups: { [key: string]: ProductInterface[] }, p) => {
                    const uuid = p.product_uid;
                    if (!groups[uuid]) groups[uuid] = [];
                    groups[uuid].push(p);
                    return groups
                }, {});

            Object.values(products).forEach((group) => {
                const product = group[0];
                total_products += Number(product.price || 0) * group.length;
            });
        } else {
            order.order.services.products.forEach((product) => {
                total_products += Number(product.price || 0) * Number(product.quantity || 0);
            });
        }
    }

    // Noches adicionales
    const total_night_pre =
        (order?.order.services?.extra_nights?.pre?.quantity || 0) *
        (Number(order?.order.services?.extra_nights?.pre?.rate) || 0);

    const total_night_pos =
        (order?.order.services?.extra_nights?.pos?.quantity || 0) *
        (Number(order?.order.services?.extra_nights?.pos?.rate) || 0);


    return {
        extras: total_free_sale,
        tours: total_tours,
        integrated_services: total_portuarios,
        insurances: total_insurances,
        products: total_products,
        night_pre: total_night_pre,
        night_pos: total_night_pos,
    }
}