import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { PriceModes } from '../../models';
import { PriceModeService } from './price-mode.service';
import { PriceModeChanged } from './state';

export class DefaultPriceModeService implements PriceModeService {
  protected activePriceMode$ = new BehaviorSubject<string>(
    this.defaultPriceMode ?? PriceModes.GrossMode
  );

  constructor(
    protected queryService = inject(QueryService),
    protected defaultPriceMode = inject('PRICE_MODE'),
    protected notificationService = inject(NotificationService)
  ) {}

  get(): Observable<string> {
    return this.activePriceMode$;
  }

  set(priceMode: string): void {
    const prev = this.activePriceMode$.value;
    this.activePriceMode$.next(priceMode);

    if (prev !== priceMode) {
      this.queryService.emit({ type: PriceModeChanged, data: { priceMode } });
    }
  }

  sendNotificationError(): void {
    this.notificationService.push({
      type: AlertType.Error,
      content: 'Error',
      subtext: 'Can’t switch price mode when there are items in the cart',
    });
  }
}
