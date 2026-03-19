import { createApiClient } from '@/api/factory/apiFactory';

export default class OrdersClient {
    private client = createApiClient('orders');

    showBloqueoRules(bloqueo_uid: string): Promise<RulesBloqueoInterface> {
        return this.client.post<RulesBloqueoInterface>(`api/rules/${bloqueo_uid}`);
    }

    // Quotes
    postQuote(payload: {}): Promise<QuoteInterface> {
        return this.client.post('api/orders/quote', payload);
    }

    updateQuote(payload: {}, uuid: string): Promise<QuoteInterface> {
        return this.client.post(`api/orders/quote/${uuid}`, payload);
    }

    showQuote(uuid: string): Promise<OrderInterface> {
        return this.client.get(`api/orders/quote/${uuid}`)
    }

    // Reservation
    showReservation(uuid: string): Promise<OrderInterface> {
        return this.client.get(`api/orders/reservation/${uuid}`)
    }

    orderReservationQuote(uuid: string, rooms: {}): Promise<OrderInterface> {
        return this.client.post(`api/orders/reservation/${uuid}/quote`, rooms)
    }

    orderReservationPsgMain(uuid: string, puid: string, info: {}): Promise<OrderInterface> {
        return this.client.post(`api/orders/reservation/${uuid}/passenger/${puid}/main`, info)
    }

    orderReservationTwin(uuid: string, info: {}): Promise<OrderInterface> {
        return this.client.post(`api/orders/reservation/${uuid}/twin`, info)
    }

    orderReservationPsgPassport(uuid: string, puid: string): Promise<Blob> {
        return this.client.get(`api/orders/reservation/${uuid}/passenger/${puid}/passport`)
    }

    orderReservationPsg(uuid: string, puid: string): Promise<PassengerToOrderInterface> {
        return this.client.get(`api/orders/reservation/${uuid}/passenger/${puid}`)
    }

    orderReservationPsgUpdate(uuid: string, puid: string, passenger: {}): Promise<PassengerInterface> {
        return this.client.put(`api/orders/reservation/${uuid}/passenger/${puid}`, passenger)
    }

    orderReservationUpdate(uuid: string, data: {}): Promise<OrderInterface> {
        return this.client.put(`api/orders/reservation/${uuid}`, data)
    }

    // Passport
    saveMultimedia(uuid: string, puid: string, formData: FormData): Promise<Blob> {
        return this.client.post(`api/orders/reservation/${uuid}/passenger/${puid}/passport`, formData);
    }

    updatePassport(uuid: string, puid: string, data: {}): Promise<PassportPromiseInterface> {
        return this.client.post(`api/orders/reservation/${uuid}/passenger/${puid}/passport`, data);
    }

    //Tours
    postTours(uuid: string, tours_resume: {}): Promise<OrderInterface> {
        return this.client.post(`api/orders/reservation/${uuid}/additionals`, {
            tours: tours_resume
        });
    }

    postToursPassengers(uuid: string, tours_passengers: {}): Promise<OrderInterface> {
        return this.client.post(`api/orders/reservation/${uuid}/additionals/passengers`, tours_passengers)
    }

    // Actions
    orderSend(uuid: string): Promise<{}> {
        return this.client.get(`api/orders/${uuid}/send`, {
            details: 1
        });
    }

    request_cancelation(uuid: string, reazon: string): Promise<{}> {
        return this.client.post(`api/orders/${uuid}/request_cancelation`, {
            request_cancelation: 1,
            request_cancelation_reazon: reazon,
        });
    }

    request_cancelation_restore(uuid: string): Promise<{}> {
        return this.client.post(`api/orders/${uuid}/request_cancelation`, {
            request_cancelation: 0,
        });
    }

}
