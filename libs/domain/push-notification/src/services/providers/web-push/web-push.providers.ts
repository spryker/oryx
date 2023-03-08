import { Provider } from '@spryker-oryx/di';
import { PushProvider } from '../push-provider.service';
import { WebPushProvider } from './web-push';

export const webPushProviders: Provider[] = [
  {
    provide: PushProvider,
    useClass: WebPushProvider,
  },
];
