import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, Observable } from 'rxjs';
import { PriceMode, PriceModeService } from './price-mode.service';
import { PriceModeChanged } from './state';

export class DefaultPriceModeService implements PriceModeService {
  constructor(
    protected queryService = inject(QueryService),
    protected defaultPriceMode = inject(PriceMode)
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
}
