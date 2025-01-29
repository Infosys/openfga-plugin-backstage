import { OpenFgaCatalogPolicy } from './policy';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

export const permissionModuleCatalogPolicy = createBackendModule({
  pluginId: 'permission',
  moduleId: 'catalog-policy',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        policy: policyExtensionPoint,
        discovery: coreServices.discovery,
      },
      async init({ config, logger, policy, discovery }) {
        policy.setPolicy(new OpenFgaCatalogPolicy(config, discovery));
      },
    });
  },
});
