// api-client.ts

//import { enqueueSnackbar } from 'notistack';

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

interface ApiClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  authToken?: string;
  use_token_bloqueos?: boolean;
}

interface RequestOptions<TBody = unknown> {
  endpoint: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  queryParams?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null;
  private use_token_bloqueos: boolean | null;
  private token_bloqueos: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders = config.defaultHeaders || {
      'Content-Type': 'application/json',
    };
    this.authToken = config.authToken || null;
    this.use_token_bloqueos = config.use_token_bloqueos || false;
  }

  setTokenBloqueos(token: string | null): this {
    this.token_bloqueos = token;

    return this;
  }

  public setAuthToken(token: string): this {
    this.authToken = token;

    return this;
  }

  public clearAuthToken(): void {
    this.authToken = null;
  }

  public updateDefaultHeaders(headers: Record<string, string>): this {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };

    return this;
  }

  private async request<TResponse = unknown, TBody = unknown>(
    options: RequestOptions<TBody>,
  ): Promise<TResponse> {
    const {
      endpoint,
      method = 'GET',
      signal,
      headers = {},
      body,
      queryParams,
    } = options;

    // Construir URL con query params si existen
    const url = new URL(endpoint, this.baseUrl);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Preparar headers
    const requestHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (this.authToken && !this.use_token_bloqueos) {
      requestHeaders['Authorization'] = `Bearer ${this.authToken}`;
    } else {
      requestHeaders['Authorization'] = `Bearer ${this.token_bloqueos}`;
    }

    // Configurar el cuerpo de la solicitud
    let requestBody: string | FormData | null = null;

    if (body) {
      if (body instanceof FormData) {
        requestBody = body;
        // Si enviamos FormData, dejar que el navegador establezca el Content-Type
        delete requestHeaders['content-type'];
        delete requestHeaders['Content-Type'];
      } else {
        requestBody = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal,
      });

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new ApiError(response.status, errorData);
      }

      return this.parseResponse<TResponse>(response);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        /*enqueueSnackbar(error.message ?? 'Error desconocido', {
                    variant: 'error',
                });*/
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(0, {
          message: 'Network error',
          details: error,
        });
      }
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    if (contentType?.includes('text/')) {
      return response.text() as unknown as T;
    }

    return response.blob() as unknown as T;
  }

  private async parseErrorResponse(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  }

  // Métodos específicos para verbos HTTP
  public get<TResponse = unknown>(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean>,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    return this.request<TResponse>({
      endpoint,
      method: 'GET',
      headers,
      queryParams,
      signal,
    });
  }

  public post<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: 'POST',
      headers,
      body,
      signal,
    });
  }

  public put<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: 'PUT',
      headers,
      body,
      signal,
    });
  }

  public patch<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      endpoint,
      method: 'PATCH',
      headers,
      body,
      signal,
    });
  }

  public delete<TResponse = unknown>(
    endpoint: string,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    return this.request<TResponse>({
      endpoint,
      method: 'DELETE',
      headers,
      signal,
    });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
  ) {
    super(data.message || 'API Error');
    this.name = 'ApiError';
  }
}
