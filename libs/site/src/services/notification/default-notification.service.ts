import { NotificationStrategy } from '@spryker-oryx/ui/notification-center';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NotificationService } from './notification.service';

export class DefaultNotificationService implements NotificationService {
  protected notification$ = new BehaviorSubject<NotificationStrategy | null>(
    null
  );

  get(): Observable<NotificationStrategy | null> {
    return this.notification$;
  }

  push(strategy: NotificationStrategy): Observable<void> {
    //TODO We should consider improving it in the future, with abstracted or custom event system.
    window?.dispatchEvent(new CustomEvent('oryx-notify'));
    this.notification$.next(strategy);
    return of(undefined);
  }
}
