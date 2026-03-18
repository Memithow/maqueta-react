import { createApiClient } from '@/api/factory/apiFactory';

export default class SSOClient {
  private client = createApiClient('sso_login');

  current(): Promise<UserInterface> {
    return this.client.get<UserInterface>(`api/current`);
  }
}
