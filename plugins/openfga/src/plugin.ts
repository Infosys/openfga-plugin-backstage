import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { OpenFgaClient } from './OpenFgaClient';
import { openFgaApiRef } from './OpenFgaApi';

export const openfgaPlugin = createPlugin({
  id: 'openfga',
  apis: [
    createApiFactory({
      api: openFgaApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi, identityApi }) =>
        OpenFgaClient.fromConfig(configApi, discoveryApi, fetchApi, identityApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const OpenfgaPage = openfgaPlugin.provide(
  createRoutableExtension({
    name: 'OpenfgaPage',
    component: () =>
      import('./components/HeaderComponent').then(m => m.HeaderComponent),
    mountPoint: rootRouteRef,
  }),
);
