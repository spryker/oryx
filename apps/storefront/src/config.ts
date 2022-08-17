import { cartFeature } from '@spryker-oryx/cart';
import { contentFeature } from '@spryker-oryx/content';
import { app, coreFeature } from '@spryker-oryx/core';
import {
  experienceFeature,
  experiencePreviewFeature,
} from '@spryker-oryx/experience';
import { productFeature } from '@spryker-oryx/product';
import { searchFeature } from '@spryker-oryx/search';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';
import { userFeature } from '@spryker-oryx/user';
import 'urlpattern-polyfill';
import { storefrontApp } from './bootstrap';

const isPreview = new URLSearchParams(new URL(window.location.href).search).has(
  'ebPreview'
);

export const storefront = app()
  .withFeature(storefrontApp)
  .withFeature(cartFeature)
  .withFeature(contentFeature)
  .withFeature(coreFeature)
  .withFeature(experienceFeature)
  .withFeature(isPreview ? experiencePreviewFeature : {})
  .withFeature(productFeature)
  .withFeature(searchFeature)
  .withFeature(siteFeature)
  .withFeature(uiFeature)
  .withFeature(userFeature);
