import { applicationFeature } from '@spryker-oryx/application';
import { authFeature } from '@spryker-oryx/auth';
import { cartFeature } from '@spryker-oryx/cart';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { AppFeature, coreFeature, Resources } from '@spryker-oryx/core';
import { coreServerProviders } from '@spryker-oryx/core/server';
import {
  experienceFeature,
  experiencePreviewFeature,
} from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature } from '@spryker-oryx/i18n';
import { productFeature } from '@spryker-oryx/product';
import { searchFeature } from '@spryker-oryx/search';
import { siteFeature } from '@spryker-oryx/site';
import { uiFeature } from '@spryker-oryx/ui';
import { userFeature } from '@spryker-oryx/user';
import { isServer } from 'lit';
import 'urlpattern-polyfill';

const isPreview = new URLSearchParams(new URL(window.location.href).search).has(
  'ebPreview'
);

const b2cResources: Resources = {
  graphics: {
    logo: {
      source: () =>
        import('../../resources/graphics/full-logo').then((m) => m.default),
    },
  },
};

export const b2cFeatures: AppFeature[] = [
  uiFeature,
  coreFeature,
  cartFeature,
  checkoutFeature,
  contentFeature,
  formFeature,
  experienceFeature,
  isPreview ? experiencePreviewFeature : {},
  productFeature,
  searchFeature,
  siteFeature,
  applicationFeature,
  userFeature,
  authFeature,
  new I18nFeature(),
  isServer ? { providers: coreServerProviders } : {},
  {
    resources: b2cResources,
  },
];
