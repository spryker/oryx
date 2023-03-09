import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, switchMap } from 'rxjs';
import { PushProvider } from './providers';
import { pushApiType, PushService, PushServiceConfig } from './push.service';

export class DefaultPushService implements PushService {
  constructor(
    protected provider = inject(PushProvider),
    protected config = inject(PushServiceConfig),
    protected http = inject(HttpService)
  ) {}

  init(): Observable<void> {
    return this.provider.init();
  }

  subscribe(): Observable<any> {
    return this.provider
      .getSubscription()
      .pipe(switchMap((token) => this.sendToken(token)));
  }

  unsubscribe(): Observable<boolean> {
    return this.provider.deleteSubscription();
  }

  protected sendToken(token: any): Observable<any> {
    return this.http.post(`${this.config.apiUrl}/push-token`, {
      token,
      type: pushApiType,
    });
  }
}
