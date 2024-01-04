import { Notification } from '@spryker-oryx/ui/notification-center';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NotificationService } from './notification.service';

export class DefaultNotificationService implements NotificationService {
  protected notification$ = new BehaviorSubject<Notification | null>(null);

  get(): Observable<Notification | null> {
    return this.notification$;
  }

  push(strategy: Notification): Observable<void> {
    //TODO We should consider improving it in the future, with abstracted or custom event system.
    window?.dispatchEvent(new CustomEvent('oryx-notify'));
    this.notification$.next(strategy);
    return of(undefined);
  }
}
