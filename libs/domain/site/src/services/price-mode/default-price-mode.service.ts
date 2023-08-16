import { QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
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
    protected defaultPriceMode = inject('SCOS_PRICE_MODE')
  ) {}

  get(): Observable<string> {
    return this.activePriceMode$;
  }

  set(priceMode: string): void {
    const prev = this.activePriceMode$.value;
    this.activePriceMode$.next(priceMode);

    if (prev !== priceMode) {
      this.queryService.emit({ type: PriceModeChanged, data: priceMode });
    }
  }
}
