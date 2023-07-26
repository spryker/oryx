import { appBuilder } from '@spryker-oryx/application';
import { injectEnv, PageMetaResolver } from '@spryker-oryx/core';
import { ContentBackendUrl, experienceFeature } from '@spryker-oryx/experience';
import { formFeature } from '@spryker-oryx/form';
import { labsFeatures } from '@spryker-oryx/labs';
import { offlineFulfillmentFeatures } from '../../../libs/template/presets/fulfillment';
import { siteFeature } from '@spryker-oryx/site';
import { fulfillmentTheme } from '@spryker-oryx/themes';
import { fallbackEnv } from './fallback-env';

const env = import.meta.env;

appBuilder()
  .withEnvironment({ ...fallbackEnv, ...(import.meta.env as AppEnvironment) })
  .withFeature({
    // due to PageMetaResolver is conflicting with current router solution
    // need to exclude it from the services list for FA
    // TODO: drop filtering after EB integration
    providers: experienceFeature.providers?.filter(
      (feature) =>
        ![PageMetaResolver, ContentBackendUrl].includes(feature.provide)
    ),
    components: experienceFeature.components,
  })
  .withFeature({
    providers: [
      {
        provide: ContentBackendUrl,
        useFactory: () => injectEnv('ORYX_FULFILLMENT_BACKEND_URL', ''),
      },
    ],
  })
  .withFeature(siteFeature)
  .withFeature(formFeature)
  .withFeature(
    offlineFulfillmentFeatures({
      picking: {
        appVersion: import.meta.env.ORYX_FULFILLMENT_APP_VERSION,
      },
    })
  )
  .withFeature([...(env.ORYX_LABS ? labsFeatures : [])])
  .withTheme(fulfillmentTheme)
  .create()
  .then(() => console.debug('Fulfillment App started!'))
  .catch(console.error);
