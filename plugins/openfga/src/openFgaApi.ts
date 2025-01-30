import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import { OpenFgaResponse } from './types';

export const openFgaApiRef = createApiRef<OpenFgaApi>({
  id: 'plugin.openfga.customservice',
});

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
