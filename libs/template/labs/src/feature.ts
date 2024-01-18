import { AppFeature } from '@spryker-oryx/core';
import { articleProviders } from './articles';
import { bazaarVoiceComponentMapping } from './bazaarvoice';
import { cloudinaryImageConverter } from './cloudinary';
import * as components from './components';
import { i18nLabsProviders, labsI18nFeature } from './i18n';
import { merchantBanners } from './merchants';
import { myAccountFeature } from './my-account';

export * from './components';
export { labsI18nFeature } from './i18n';
export const labsComponents = Object.values(components);

/**
 * The labs package provides demo features which are more less
 * in experimental state. The features are not production ready
 * and might even be broken as they're not thoroughly tested
 * and not covered with automated tests.
 */
export const labsFeatures: AppFeature[] = [
  labsI18nFeature,
  myAccountFeature,
  {
    components: labsComponents,
    providers: [
      cloudinaryImageConverter,
      bazaarVoiceComponentMapping,
      ...articleProviders,
      ...i18nLabsProviders,
      merchantBanners,
    ],
  },
];
