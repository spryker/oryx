import { appBuilder } from '@spryker-oryx/core';
import { labsFeature } from '@spryker-oryx/labs';
import { b2cFeatures, b2cTheme } from '@spryker-oryx/presets';

export const app = appBuilder()
  .withFeature(b2cFeatures)
  .withFeature(labsFeature)
  .withTheme(b2cTheme)
  .withEnvironment(import.meta.env)
  .withOptions({
    'oryx-user-summary': {
      items: [{
        link: '/add',
        title: 'link 1',
        icon: 'add',
      }, {
        link: '/trash',
        title: 'link 2',
        icon: 'trash',
      }]
    }
  })
  .create();
