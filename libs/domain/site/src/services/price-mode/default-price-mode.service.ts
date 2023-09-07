import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { PriceMode, PriceModeService } from './price-mode.service';
import { PriceModeChanged } from './state';

export class DefaultPriceModeService implements PriceModeService {
  constructor(
    protected queryService = inject(QueryService),
    protected defaultPriceMode = inject(PriceMode),
    protected notificationService = inject(NotificationService)
  ) {}

  protected priceMode$ = new BehaviorSubject(this.defaultPriceMode);

  get(): Observable<string> {
    return this.priceMode$;
  }

  set(priceMode: string): void {
    const prev = this.priceMode$.value;

    if (prev === priceMode) {
      return;
    }

    this.priceMode$.next(priceMode);
    this.queryService.emit({ type: PriceModeChanged, data: { priceMode } });
  }

  protected sendNotificationError(): void {
    this.notificationService.push({
      type: AlertType.Error,
      content: 'Error',
      subtext: 'Can’t switch price mode when there are items in the cart',
    });
  }
}
