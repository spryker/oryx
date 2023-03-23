import { Provider } from '@spryker-oryx/di';
import { PushProvider } from '@spryker-oryx/push-notification';
import { WebPushProvider } from './web-push';

export const webPushProviders: Provider[] = [
  {
    provide: PushProvider,
    useClass: WebPushProvider,
  },
];
