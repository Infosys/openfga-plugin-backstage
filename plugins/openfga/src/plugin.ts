import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const openfgaPlugin = createPlugin({
  id: 'openfga',
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
