import { AppFeature, injectEnv } from '@spryker-oryx/core';
import {
  PushNotificationFeature,
  PushServiceConfig,
} from '@spryker-oryx/push-notification';

export class BapiPushNotificationFeature
  extends PushNotificationFeature
  implements AppFeature
{
  protected static defaultConfigFactory(): PushServiceConfig {
    return {
      apiUrl: injectEnv('ORYX_FULFILLMENT_BACKEND_URL'),
    };
  }

  constructor(
    config:
      | PushServiceConfig
      | (() => PushServiceConfig) = BapiPushNotificationFeature.defaultConfigFactory
  ) {
    super(config);
  }
}
