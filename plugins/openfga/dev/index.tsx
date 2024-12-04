import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { openfgaPlugin, OpenfgaPage } from '../src/plugin';

createDevApp()
  .registerPlugin(openfgaPlugin)
  .addPage({
    element: <OpenfgaPage />,
    title: 'Root Page',
    path: '/openfga',
  })
  .render();
