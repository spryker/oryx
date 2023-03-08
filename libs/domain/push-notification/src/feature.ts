import { AppFeature } from '@spryker-oryx/core';
import { pushNotificationProviders } from './services';

export const PushNotificationFeature: AppFeature = {
  providers: pushNotificationProviders,
};
