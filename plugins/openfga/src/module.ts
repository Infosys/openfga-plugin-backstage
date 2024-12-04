import { AOpenFgaCatalogPolicy } from './policy';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

export const permissionModuleACatalogPolicy = createBackendModule({
  pluginId: 'permission',
  moduleId: 'a-name-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        // Accessing the configuration from the backend environment
        // const config: Config = useApi(configApiRef);

        policy.setPolicy(new AOpenFgaCatalogPolicy());
      },
    });
  },
});
