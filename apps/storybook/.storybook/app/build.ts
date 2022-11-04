import { mockAuthFeature } from '@spryker-oryx/auth/mocks';
import { mockCartFeature } from '@spryker-oryx/cart/mocks';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { app } from '@spryker-oryx/core';
import { mockCoreFeature } from '@spryker-oryx/core/mocks';
import { mockExperienceFeature } from '@spryker-oryx/experience/mocks';
import { formFeature } from '@spryker-oryx/form';
import { launchpadUiFeature } from '@spryker-oryx/launchpad-ui';
import { mockProductFeature } from '@spryker-oryx/product/mocks';
import { mockSearchFeature } from '@spryker-oryx/search/mocks';
import { mockSiteFeature } from '@spryker-oryx/site/mocks';
import { uiFeature } from '@spryker-oryx/ui';
import { mockUserFeature } from '@spryker-oryx/user/mocks';
import { chromaticTheme } from './chromatic';
import { StorybookPlugin } from './plugin';
import { theme } from './theme';
import { getActiveTheme } from './utils';

const themeKey = (getActiveTheme() ?? theme.default) as keyof typeof theme.list;

app()
  .with(new StorybookPlugin())
  .withOptions({
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
  .withFeature(checkoutFeature)
  .withFeature(contentFeature)
  .withFeature(mockProductFeature)
  .withFeature(mockSearchFeature)
  .withFeature(mockSiteFeature)
  .withFeature(mockUserFeature)
  .withFeature(launchpadUiFeature)
  .withFeature(mockAuthFeature)
  .withTheme([...theme.list[themeKey], chromaticTheme])
  .create()
  .catch(console.error);
