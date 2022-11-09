import { authFeature } from '@spryker-oryx/auth';
import { cartFeature } from '@spryker-oryx/cart';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { app, coreFeature } from '@spryker-oryx/core';
import {
  experienceFeature,
  experiencePreviewFeature,
} from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { productFeature } from '@spryker-oryx/product';
import { searchFeature } from '@spryker-oryx/search';
import { siteFeature } from '@spryker-oryx/site';
import { storefrontFeature } from '@spryker-oryx/storefront';
import { storefrontTheme } from '@spryker-oryx/theme';
import { uiFeature } from '@spryker-oryx/ui';
import { userFeature } from '@spryker-oryx/user';
import 'urlpattern-polyfill';
import { appFeature } from './feature';

const isPreview = new URLSearchParams(new URL(window.location.href).search).has(
  'ebPreview'
);

export const appBuilder = app()
  .withFeature(uiFeature)
  .withFeature(coreFeature)
  .withFeature(cartFeature)
  .withFeature(checkoutFeature)
  .withFeature(contentFeature)
  .withFeature(formFeature)
  .withFeature(experienceFeature)
  .withFeature(isPreview ? experiencePreviewFeature : {})
  .withFeature(productFeature)
  .withFeature(searchFeature)
  .withFeature(siteFeature)
  .withFeature(storefrontFeature)
  .withFeature(appFeature)
  .withFeature(userFeature)
  .withFeature(authFeature)
  .withTheme(storefrontTheme);
