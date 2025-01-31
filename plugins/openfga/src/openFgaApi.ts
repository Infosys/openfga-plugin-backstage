import { createApiRef, ConfigApi, DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { OpenFgaResponse } from './types';
import { OpenFgaClient } from './OpenFgaClient';

// Define the API reference
export const openFgaApiRef = createApiRef<OpenFgaApi>({
  id: 'plugin.openfga.customservice',
});

// Define the API interface
export interface OpenFgaApi {
  sendPermissionRequest(
    entityName: string,
    action: string,
    userName: any,
  ): Promise<OpenFgaResponse>;
  addPolicy(
    entityName: string,
    accessType: string,
    userName: any,
  ): Promise<OpenFgaResponse>;
  revokePolicy(
    entityName: string,
    accessType: string,
    userName: any,
  ): Promise<OpenFgaResponse>;
}

// Create the API factory
export const openFgaApiFactory = {
  deps: {
    configApi: createApiRef<ConfigApi>({ id: 'core.config' }),
    discoveryApi: createApiRef<DiscoveryApi>({ id: 'core.discovery' }),
    identityApi: createApiRef<IdentityApi>({ id: 'core.identity' }),
  },
  factory: ({ configApi, discoveryApi, identityApi }) => {
    const openFgaConfig = configApi.getConfig('openfga');
    const baseUrl = openFgaConfig.getOptionalString('baseUrl') ?? '';
    const storeId = openFgaConfig.getOptionalString('storeId') ?? '';
    const authorizationModelId = openFgaConfig.getOptionalString('authorizationModelId') ?? '';

    return new OpenFgaClient({
      discoveryApi,
      baseUrl,
      storeId,
      authorizationModelId,
    });
  },
};
