import { mockAuthFeature } from '@spryker-oryx/auth/mocks';
import { mockCartFeature } from '@spryker-oryx/cart/mocks';
import { checkoutFeature } from '@spryker-oryx/checkout';
import { contentFeature } from '@spryker-oryx/content';
import { appBuilder } from '@spryker-oryx/core';
import { mockCoreFeature } from '@spryker-oryx/core/mocks';
import { mockExperienceFeature } from '@spryker-oryx/experience/mocks';
import { formFeature } from '@spryker-oryx/form';
import { I18nFeature } from '@spryker-oryx/i18n';
import { launchpadUiFeature } from '@spryker-oryx/launchpad-ui';
import { mockProductFeature } from '@spryker-oryx/product/mocks';
import { mockSearchFeature } from '@spryker-oryx/search/mocks';
import { mockSiteFeature } from '@spryker-oryx/site/mocks';
import { uiFeature } from '@spryker-oryx/ui';
import { mockUserFeature } from '@spryker-oryx/user/mocks';
import { HOOKS_KEY, IconHookToken } from '@spryker-oryx/utilities';
import isChromatic from 'chromatic/isChromatic';
import {
  chromaticIconHook,
  chromaticStyledComponents,
  ThemeChromaticPlugin,
} from './chromatic';
import { StorybookPlugin } from './plugin';
import { theme } from './theme';
import { getActiveTheme } from './utils';

const themeKey = (getActiveTheme() ?? theme.default) as keyof typeof theme.list;
const themes = [...theme.list[themeKey]];
// TODO: Drop chromatic folder (except styles) when chromatic issue will be fixed.
const themeProps = isChromatic() ? new ThemeChromaticPlugin(themes) : themes;

appBuilder()
  .with(new StorybookPlugin())
  .withOptions({
    components: {
      root: 'body',
      preload: true,
      ...(isChromatic()
        ? {
            [HOOKS_KEY]: {
              [IconHookToken]: chromaticIconHook,
            },
          }
        : {}),
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
  .withComponents(isChromatic() ? chromaticStyledComponents : [])
  [isChromatic() ? 'with' : 'withTheme'](themeProps as any)
  .withFeature(new I18nFeature())
  .create()
  .catch(console.error);
