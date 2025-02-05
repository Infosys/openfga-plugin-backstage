import { ConfigApi, DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { OpenFgaApi } from '@infosys_ltd/backstage-plugin-openfga-common';
import { OpenFgaRequest, OpenFgaResponse } from '@infosys_ltd/backstage-plugin-openfga-common';

export class openFgaPolicyEvaluator implements OpenFgaApi {
  readonly discoveryApi: DiscoveryApi;
  private readonly baseUrl: string;
  private readonly storeId: string;
  private readonly authorizationModelId: string;
  private permissionResponse: OpenFgaResponse | null;

  static fromConfig(
    configApi: ConfigApi,
    discoveryApi: DiscoveryApi,
  ) {
    const baseUrl: string = configApi.getOptionalString('openfga.baseUrl') ?? '';
    const storeId: string = configApi.getOptionalString('openfga.storeId') ?? '';
    const authorizationModelId: string = configApi.getOptionalString('openfga.authorizationModelId') ?? '';

    if (!storeId || !authorizationModelId) {
      console.error('Missing configuration values for OpenFGA. Please check your app-config.yaml.');
    }

    return new openFgaPolicyEvaluator({
      discoveryApi,
      baseUrl,
      storeId,
      authorizationModelId,
    });
  }

  constructor(opts: {
    discoveryApi: DiscoveryApi;
    baseUrl: string;
    storeId: string;
    authorizationModelId: string;
  }) {
    this.discoveryApi = opts.discoveryApi;
    this.baseUrl = opts.baseUrl;
    this.storeId = opts.storeId;
    this.authorizationModelId = opts.authorizationModelId;
    this.permissionResponse = null;
  }

  public getPermissionResponse(): OpenFgaResponse | null {
    return this.permissionResponse;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const apiUrl = `${this.baseUrl}${input}`;
    const response = await fetch(apiUrl, init);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  public async sendPermissionRequest(
    entityName: string,
    action: string,
    userName: any,
  ): Promise<OpenFgaResponse> {
    const url = `/stores/${this.storeId}/check`;

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
    const url = `/stores/${this.storeId}/write`;

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
    const url = `/stores/${this.storeId}/write`;

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
