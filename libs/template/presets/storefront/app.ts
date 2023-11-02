import { applicationFeature } from '@spryker-oryx/application';
import { SapiAuthComponentsFeature, SapiAuthFeature } from '@spryker-oryx/auth';
import { cartFeature } from '@spryker-oryx/cart';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { coreServerProviders } from '@spryker-oryx/core/server';
import {
  Resources,
  experienceFeature,
  experiencePreviewFeature,
  experienceRoutesFeature,
} from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature } from '@spryker-oryx/i18n';
import { orderFeature } from '@spryker-oryx/order';
import { productFeature } from '@spryker-oryx/product';
import {
  brandGraphics,
  commonGraphics,
  materialDesignLink,
} from '@spryker-oryx/resources';
import { RouterFeature } from '@spryker-oryx/router';
import { searchFeature, searchPreviewProviders } from '@spryker-oryx/search';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';
import { userFeature } from '@spryker-oryx/user';
import { isServer } from 'lit';
import 'urlpattern-polyfill';
import { StaticExperienceFeature } from './experience';

const isPreview = new URLSearchParams(
  new URL(globalThis.location?.href).search
).has('ebPreview');

export const storefrontResources: Resources = {
  graphics: { ...commonGraphics, ...brandGraphics },
  fonts: materialDesignLink,
};

export const storefrontFeatures: AppFeature[] = [
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
  isPreview ? { providers: searchPreviewProviders } : {},
  {
    resources: storefrontResources,
  },
  StaticExperienceFeature,
];
