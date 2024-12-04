import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content
} from '@backstage/core-components';
import { OpenfgaCatalogComponent } from '../OpenfgaCatalogComponent';

export const HeaderComponent = () => (
  <Page themeId="tool">
    <Header title="OpenFGA Permission">
    </Header>
    <Content>
      <Grid container>
        <Grid item>
          <OpenfgaCatalogComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
