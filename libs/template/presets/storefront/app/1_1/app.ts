import { applicationFeature } from '@spryker-oryx/application';
import { SapiAuthComponentsFeature, SapiAuthFeature } from '@spryker-oryx/auth';
import { cartFeature } from '@spryker-oryx/cart';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { coreServerProviders } from '@spryker-oryx/core/server';
import {
  experienceFeature_1_1,
  experiencePreviewFeature_1_1,
  experienceRoutesFeature_1_1,
} from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature } from '@spryker-oryx/i18n';
import { orderFeature } from '@spryker-oryx/order';
import { productFeature } from '@spryker-oryx/product';
import { RouterFeature } from '@spryker-oryx/router';
import { searchFeature, searchPreviewProviders } from '@spryker-oryx/search';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';
import { userFeature } from '@spryker-oryx/user';
import { isServer } from 'lit';
import 'urlpattern-polyfill';
import { storefrontResources } from '../1_0';
import { staticExperienceLatestFeature } from './experience';

const isPreview = new URLSearchParams(
  new URL(globalThis.location?.href).search
).has('ebPreview');

export const storefrontResources_1_1 = storefrontResources;

export const storefrontFeatures_1_1: AppFeature[] = [
  uiFeature,
  coreFeature,
  new SapiAuthFeature(),
  new SapiAuthComponentsFeature(),
  new RouterFeature(),
  new I18nFeature(),
  cartFeature,
  checkoutFeature,
  orderFeature,
  contentFeature,
  formFeature,
  productFeature,
  searchFeature,
  siteFeature,
  applicationFeature,
  userFeature,
  isServer ? { providers: coreServerProviders } : {},
  ...(isPreview
    ? [experiencePreviewFeature_1_1, { providers: searchPreviewProviders }]
    : [{}]),
  experienceFeature_1_1,
  experienceRoutesFeature_1_1,
  {
    resources: storefrontResources_1_1,
  },
  staticExperienceLatestFeature,
];
