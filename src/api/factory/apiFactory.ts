import { ApiClient } from '@/api/clients/ApiClient';
import * as authHelper from '@/auth/lib/helpers';

const apiConfigurations: Record<string, any> = {
  sso_server: {
    baseUrl: import.meta.env.VITE_SSO_SERVER,
    use_token_bloqueos: false,
    authToken: import.meta.env.VITE_TOKEN_AUTH_SSO,
    defaultHeaders: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/json',
    },
  },

  sso_login: {
    baseUrl: import.meta.env.VITE_SSO_LOGIN,
    use_token_bloqueos: true,
    defaultHeaders: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/json',
    },
  },

  bloqueos: {
    baseUrl: import.meta.env.VITE_MICROSERVICE_API_EXATRAVEL_BLOQUEOS,
    use_token_bloqueos: true,
    defaultHeaders: {
      'content-type': 'application/json',
      accept: 'application/json, text/javascript, */*; q=0.01',
    },
  },

  orders: {
    baseUrl: import.meta.env.VITE_MICROSERVICE_API_EXATRAVEL_ORDERS,
    use_token_bloqueos: true,
    defaultHeaders: {
      'content-type': 'application/json',
      accept: 'application/json, text/javascript, */*; q=0.01',
      'app-source': 'exa-orders',
      'app-request': 'exa-orders'
    },
  },

  customers: {
    baseUrl: import.meta.env.VITE_MICROSERVICE_API_EXATRAVEL_CUSTOMER,
    use_token_bloqueos: true,
    defaultHeaders: {
      'content-type': 'application/json',
      accept: 'application/json, text/javascript, */*; q=0.01',
    },
  },
};

const clientsCache: Partial<Record<string, ApiClient>> = {};

export function createApiClient(type: string): ApiClient {
  if (clientsCache[type]) {
    return clientsCache[type]!;
  }

  const auth = authHelper.getAuth();

  const token = auth?.token ?? '';
  const config = apiConfigurations[type];
  const client = new ApiClient(config);

  if (config?.use_token_bloqueos && token !== '') {
    client.setTokenBloqueos(token);
    clientsCache[type] = client;
  }

  return client;
}
