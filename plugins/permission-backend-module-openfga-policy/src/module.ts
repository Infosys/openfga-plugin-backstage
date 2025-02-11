import { OpenFgaCatalogPolicy } from './policy';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

export const permissionModuleOpenFGAPolicy = createBackendModule({
  pluginId: 'permission',
  moduleId: 'openfga-policy',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        policy: policyExtensionPoint,
        discovery: coreServices.discovery,
      },
      async init({ config, policy, discovery }) {
        policy.setPolicy(new OpenFgaCatalogPolicy(config, discovery));
      },
    });
  },
});
