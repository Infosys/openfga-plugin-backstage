import { PolicyDecision } from '@backstage/plugin-permission-common';
import { PermissionPolicy, PolicyQuery, PolicyQueryUser } from '@backstage/plugin-permission-node';
import { ConfigApi, DiscoveryApi } from '@backstage/core-plugin-api';
export declare class OpenFgaCatalogPolicy implements PermissionPolicy {
    private openFgaClient;
    constructor(configApi: ConfigApi, discoveryApi: DiscoveryApi);
    handle(request: PolicyQuery, user?: PolicyQueryUser): Promise<PolicyDecision>;
}
