import { createApiClient } from '@/api/factory/apiFactory';

export default class SSOServerClient {
  private client = createApiClient('sso_server');

  getUMOUser(token_auth: string): Promise<UMOUserInterface> {
    return this.client
      .setAuthToken(import.meta.env.VITE_TOKEN_AUTH_SSO)
      .updateDefaultHeaders({
        broker: import.meta.env.VITE_SSO_BROKER_NAME,
        token: token_auth,
      })
      .post<UMOUserInterface>(`umo/token`);
  }
}
