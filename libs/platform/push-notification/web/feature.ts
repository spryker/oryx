import { PushNotificationFeature } from '@spryker-oryx/push-notification';
import { webPushProviders } from './web-push.providers';

export class WebPushNotificationFeature extends PushNotificationFeature {
  constructor() {
    super();
    this.providers = [...this.providers, ...webPushProviders];
  }
}
