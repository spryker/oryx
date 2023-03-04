import { NotificationStrategy } from '@spryker-oryx/ui/notification-center';
import { Observable } from 'rxjs';

export const NotificationService = 'oryx.NotificationService';

export interface NotificationService {
  get(): Observable<NotificationStrategy | null>;
  push(strategy: NotificationStrategy): Observable<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [NotificationService]: NotificationService;
  }
}
