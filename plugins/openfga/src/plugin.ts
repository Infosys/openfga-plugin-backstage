import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { OpenFgaClient, openFgaApiRef } from './client';

export const openfgaPlugin = createPlugin({
  id: 'openfga',
  apis: [
    createApiFactory({
      api: openFgaApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        OpenFgaClient.fromConfig(configApi, discoveryApi, fetchApi),
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
