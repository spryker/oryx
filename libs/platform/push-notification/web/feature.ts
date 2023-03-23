import { PushNotificationFeature } from '@spryker-oryx/push-notification';
import { webPushProviders } from './web-push.providers';

export class WebPushFeature extends PushNotificationFeature {
  constructor() {
    super();
    this.providers = [...this.providers, ...webPushProviders];
  }
}
