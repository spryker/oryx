import {
  applicationFeature,
  SapiAuthComponentsFeature,
  SapiAuthFeature,
} from '@spryker-oryx/application';
import { cartFeature } from '@spryker-oryx/cart';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { AppFeature, coreFeature, Resources } from '@spryker-oryx/core';
import { coreServerProviders } from '@spryker-oryx/core/server';
import {
  experienceFeature,
  experiencePreviewFeature,
  experienceRoutesFeature,
} from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature } from '@spryker-oryx/i18n';
import { orderFeature } from '@spryker-oryx/order';
import { productFeature } from '@spryker-oryx/product';
import { RouterFeature } from '@spryker-oryx/router';
import { searchFeature } from '@spryker-oryx/search';
import { siteFeature } from '@spryker-oryx/site';
import { storefrontTheme } from '@spryker-oryx/themes';
import { uiFeature } from '@spryker-oryx/ui';
import { userFeature } from '@spryker-oryx/user';
import { isServer } from 'lit';
import 'urlpattern-polyfill';
import { resourceGraphics } from '../../resources';
import { StaticExperienceFeature } from './experience';

const isPreview = new URLSearchParams(
  new URL(globalThis.location?.href).search
).has('ebPreview');

export const b2cResources: Resources = {
  graphics: {
    ...resourceGraphics,
  },
};

export const b2cFeatures: AppFeature[] = [
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
  experienceFeature,
  experienceRoutesFeature,
  isPreview ? experiencePreviewFeature : {},
  productFeature,
  searchFeature,
  siteFeature,
  applicationFeature,
  userFeature,
  isServer ? { providers: coreServerProviders } : {},
  {
    resources: b2cResources,
  },
  StaticExperienceFeature,
];

export const b2cTheme = { ...storefrontTheme };
