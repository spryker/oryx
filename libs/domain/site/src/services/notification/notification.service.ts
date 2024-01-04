import { Notification } from '@spryker-oryx/ui/notification-center';
import { Observable } from 'rxjs';

export const NotificationService = 'oryx.NotificationService';

export interface NotificationService {
  get(): Observable<Notification | null>;
  push(strategy: Notification): Observable<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [NotificationService]: NotificationService;
  }
}
