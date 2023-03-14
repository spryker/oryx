import { I18nFeature } from '@spryker-oryx/i18n';
import { bazaarVoiceComponentMapping } from './bazaarvoice';
import { cloudinaryImageConverter } from './cloudinary';
import * as components from './components';
export * from './components';

// tmp solution until we've published our packages and we can pull this from core
type AppFeature = any;

export const labsComponents = Object.values(components);

/**
 * The labs package provides demo features which are more less
 * in experimental state. The features are not production ready
 * and might even be broken as they're not thoroughly tested
 * and not covered with automated tests.
 */
export const labsFeature: AppFeature[] = [
  {
    components: labsComponents,
    providers: [cloudinaryImageConverter, bazaarVoiceComponentMapping],
  },
  new I18nFeature({
    load: (localeId) => import(`./i18n/${localeId}.ts`),
  }),
];
