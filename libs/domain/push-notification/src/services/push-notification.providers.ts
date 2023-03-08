import { Provider } from '@spryker-oryx/di';
import { DefaultPushService } from './default-push.service';
import { webPushProviders } from './providers';
import { PushService } from './push.service';

export const pushNotificationProviders: Provider[] = [
  {
    provide: PushService,
    useClass: DefaultPushService,
  },
  ...webPushProviders,
];
