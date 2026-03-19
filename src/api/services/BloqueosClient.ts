import { createApiClient } from '@/api/factory/apiFactory';
import type {BloqueoSearchInterface} from '@/api/types'

export default class BloqueosClient {
    private client = createApiClient('bloqueos');

    searchBloqueos(keyword: string, signal?: AbortSignal): Promise<BloqueoSearchInterface[]> {
        return this.client.get<BloqueoSearchInterface[]>(
            'api/bloqueos',{
                term:keyword,
                keyword:keyword,
                export:'select',
                _type:'query',
                exatravel: '1',
            },
            {},
            signal
        );
    }
}
