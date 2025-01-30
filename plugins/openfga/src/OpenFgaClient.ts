import { ConfigApi, DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import { AuthenticationError, ResponseError } from '@backstage/errors';
import { OpenFgaApi } from './OpenFgaApi';
import { OpenFgaRequest, OpenFgaResponse } from './types';

const DEFAULT_PROXY_PATH = '/openfga';

export class OpenFgaClient implements OpenFgaApi {
  readonly discoveryApi: DiscoveryApi;
  readonly fetchApi: FetchApi;
  readonly identityApi: IdentityApi;
  private readonly proxyPath: string;
  private readonly baseUrl: string;
  private readonly storeId: string;
  private readonly authorizationModelId: string;
  private permissionResponse: OpenFgaResponse | null;

  static fromConfig(
    configApi: ConfigApi,
    discoveryApi: DiscoveryApi,
    fetchApi: FetchApi,
    identityApi: IdentityApi,
  ) {
    const baseUrl: string =
      configApi.getOptionalString('openFga.baseUrl') ?? 'http://localhost:8080';
    const storeId: string =
      configApi.getOptionalString('openFga.storeId') ?? '';
    const authorizationModelId: string =
      configApi.getOptionalString('openFga.authorizationModelId') ?? '';

    return new OpenFgaClient({
      discoveryApi,
      fetchApi,
      identityApi,
      baseUrl,
      storeId,
      authorizationModelId,
      proxyPath:
        configApi.getOptionalString('openFga.proxyPath') ?? DEFAULT_PROXY_PATH,
    });
  }

  constructor(opts: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    identityApi: IdentityApi;
    baseUrl: string;
    storeId: string;
    authorizationModelId: string;
    proxyPath: string;
  }) {
    this.discoveryApi = opts.discoveryApi;
    this.fetchApi = opts.fetchApi;
    this.identityApi = opts.identityApi;
    this.baseUrl = opts.baseUrl;
    this.storeId = opts.storeId;
    this.authorizationModelId = opts.authorizationModelId;
    this.proxyPath = opts.proxyPath;
    this.permissionResponse = null;

    // Debugging: Log the configuration values
    console.log('OpenFGA Base URL backend log:', this.baseUrl);
    console.log('OpenFGA Store ID backend log:', this.storeId);
    console.log(
      'OpenFGA Authorization Model ID backend log:',
      this.authorizationModelId,
    );
  }

  public getPermissionResponse(): OpenFgaResponse | null {
    return this.permissionResponse;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const apiUrl = await this.apiUrl();

    const response = await this.fetchApi.fetch(`${apiUrl}${input}`, init);
    if (response.status === 401) {
      throw new AuthenticationError(
        'This request requires HTTP authentication.',
      );
    }
    if (!response.ok || response.status >= 400) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  private async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }

  public async sendPermissionRequest(
    entityName: string,
    action: string,
    userName: any,
  ): Promise<OpenFgaResponse> {
    const url = `${await this.apiUrl()}/stores/${this.storeId}/check`;

    const relation =
      typeof action === 'string' && action.toLowerCase() === 'delete'
        ? 'catalog_entity_delete'
        : 'catalog_entity_read';

    const requestBody: OpenFgaRequest = {
      tuple_key: {
        user: `${userName}`,
        relation,
        object: `catalog_entity:${entityName}`,
      },
      authorization_model_id: this.authorizationModelId,
    };

    const response = await this.fetch<OpenFgaResponse>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    this.permissionResponse = response;
    return response;
  }

  public async addPolicy(
    entityName: string,
    accessType: string,
    userName: any,
  ): Promise<OpenFgaResponse> {
    const url = `${await this.apiUrl()}/stores/${this.storeId}/write`;

    const requestBody = {
      writes: {
        tuple_keys: [
          {
            user: `${userName}`,
            relation: accessType,
            object: `catalog_entity:${entityName}`,
          },
        ],
      },
      authorization_model_id: this.authorizationModelId,
    };

    const response = await this.fetch<OpenFgaResponse>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    return response;
  }

  public async revokePolicy(
    entityName: string,
    accessType: string,
    userName: any,
  ): Promise<OpenFgaResponse> {
    const url = `${await this.apiUrl()}/stores/${this.storeId}/write`;

    const requestBody = {
      deletes: {
        tuple_keys: [
          {
            user: `${userName}`,
            relation: accessType,
            object: `catalog_entity:${entityName}`,
          },
        ],
      },
      authorization_model_id: this.authorizationModelId,
    };

    const response = await this.fetch<OpenFgaResponse>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    return response;
  }
}
