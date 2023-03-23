import { PushNotificationFeature } from '@spryker-oryx/push-notification';
import { webPushProviders } from './web-push.providers';

export class WebPushNotificationFeature extends PushNotificationFeature {
  providers = [...super.providers, ...webPushProviders];
}
