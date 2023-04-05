import { AppFeature } from '@spryker-oryx/core';
import { pushNotificationProviders } from './services';

export class PushNotificationFeature implements AppFeature {
  providers = pushNotificationProviders;
}
