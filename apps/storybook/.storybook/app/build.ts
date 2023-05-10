import { appBuilder } from '@spryker-oryx/application';
import { MockAuthFeature } from '@spryker-oryx/auth/mocks';
import { mockCartFeature } from '@spryker-oryx/cart/mocks';
import { mockCheckoutFeature } from '@spryker-oryx/checkout/mocks';
import { contentFeature } from '@spryker-oryx/content';
import { mockCoreFeature } from '@spryker-oryx/core/mocks';
import { mockExperienceFeature } from '@spryker-oryx/experience/mocks';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature } from '@spryker-oryx/i18n';
import { mockOrderFeature } from '@spryker-oryx/order/mocks';
import { mockPickingFeature } from '@spryker-oryx/picking/src/mocks';
import { mockProductFeature } from '@spryker-oryx/product/mocks';
import { mockSearchFeature } from '@spryker-oryx/search/mocks';
import { mockSiteFeature } from '@spryker-oryx/site/mocks';
import { uiFeature } from '@spryker-oryx/ui';
import { mockUserFeature } from '@spryker-oryx/user/mocks';
import isChromatic from 'chromatic/isChromatic';
import {
  chromaticStyledComponents,
  ResourcesChromaticPlugin,
} from './chromatic';
import { resource, theme } from './data';
import { StorybookPlugin } from './plugin';
import {
  getActiveData,
  ORYX_STORYBOOK_RESOURCE,
  ORYX_STORYBOOK_THEME,
} from './utils';

const themeKey = (getActiveData(ORYX_STORYBOOK_THEME) ??
  theme.default) as keyof typeof theme.list;
const resourceKey = (getActiveData(ORYX_STORYBOOK_RESOURCE) ??
  resource.default) as keyof typeof resource.list;
const themes = theme.list[themeKey];
const resources = resource.list[resourceKey];

const builder = appBuilder()
  .with(new StorybookPlugin())
  .withAppOptions({
    components: {
      root: 'body',
      preload: true,
    },
  })
  .withFeature(mockExperienceFeature)
  .withFeature(uiFeature)
  .withFeature(formFeature)
  .withFeature(mockCoreFeature)
  .withFeature(mockCartFeature)
  .withFeature(mockCheckoutFeature)
  .withFeature(mockOrderFeature)
  .withFeature(mockPickingFeature)
  .withFeature(contentFeature)
  .withFeature(mockProductFeature)
  .withFeature(mockSearchFeature)
  .withFeature(mockSiteFeature)
  .withFeature(mockUserFeature)
  .withFeature(new I18nFeature())
  .withFeature(new MockAuthFeature())
  .withTheme(themes);

// TODO: Find another way without overriding injectables
if (isChromatic()) {
  builder
    .withComponents(chromaticStyledComponents)
    .with([new ResourcesChromaticPlugin(resources)])
    .create();
} else {
  builder.withResources(resources).create();
}
