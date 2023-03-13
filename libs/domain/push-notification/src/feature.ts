import { AppFeature } from '@spryker-oryx/core';
import { pushNotificationProviders, PushServiceConfig } from './services';

export class PushNotificationFeature implements AppFeature {
  providers;

  constructor(config: PushServiceConfig | (() => PushServiceConfig)) {
    const configFactory = typeof config === 'function' ? config : () => config;
    this.providers = [
      {
        provide: PushServiceConfig,
        useFactory: () => configFactory(),
      },
      ...pushNotificationProviders,
    ];
  }
}
