import { createApiClient } from '../factory/apiFactory';

export default class CustomersClient {
    private client = createApiClient('customers');

    getClients( querySearch: string ): Promise<CustomerInterface[]> {
        return this.client.get<CustomerInterface[]>('api/customers',{
            type : 'CustomerA',
            q : querySearch,
            branch: 'EXA',
            _ : '1766088829559',
        });
    }

    getClientAgents( mc: string, querySearch: string ): Promise<AgentInterface[]> {
        return this.client.get<AgentInterface[]>(`api/customers/${ mc }/agents`,{
            q : querySearch,
            _ : '1766088829559',
        })
    }
}
