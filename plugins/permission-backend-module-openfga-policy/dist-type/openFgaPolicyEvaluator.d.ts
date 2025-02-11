import { ConfigApi, DiscoveryApi } from '@backstage/core-plugin-api';
import { OpenFgaApi } from '@infosys_ltd/backstage-plugin-openfga-common';
import { OpenFgaResponse } from '@infosys_ltd/backstage-plugin-openfga-common';
export declare class openFgaPolicyEvaluator implements OpenFgaApi {
    readonly discoveryApi: DiscoveryApi;
    private readonly baseUrl;
    private readonly storeId;
    private readonly authorizationModelId;
    private permissionResponse;
    static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi): openFgaPolicyEvaluator;
    constructor(opts: {
        discoveryApi: DiscoveryApi;
        baseUrl: string;
        storeId: string;
        authorizationModelId: string;
    });
    getPermissionResponse(): OpenFgaResponse | null;
    private fetch;
    sendPermissionRequest(entityName: string, action: string, userName: any): Promise<OpenFgaResponse>;
    addPolicy(entityName: string, accessType: string, userName: any): Promise<OpenFgaResponse>;
    revokePolicy(entityName: string, accessType: string, userName: any): Promise<OpenFgaResponse>;
}
