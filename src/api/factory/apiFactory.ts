import { ApiClient } from '@/api/clients/ApiClient';
import * as authHelper from '@/auth/lib/helpers';

const apiConfigurations: Record<string, any> = {
  sso_server: {
    baseUrl: import.meta.env.VITE_SSO_SERVER,
    use_token_bloqueos: false,
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
