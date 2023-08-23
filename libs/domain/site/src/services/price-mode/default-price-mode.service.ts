import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';

import { BehaviorSubject, Observable } from 'rxjs';
import { PriceModes } from '../../models';
import { PriceModeGuard } from '../site.providers';
import { PriceModeService } from './price-mode.service';
import { PriceModeChanged } from './state';

export class DefaultPriceModeService implements PriceModeService {
  protected activePriceMode$ = new BehaviorSubject<string>(
    this.defaultPriceMode ?? PriceModes.GrossMode
  );

  // 1st add the guard: price mode guards, cart will have some check
  // add injection token as pricemodechangeguard
  constructor(
    protected http = inject(HttpService),
    protected queryService = inject(QueryService),
    protected identity = inject(IdentityService),
    protected priceModeGuard = inject(PriceModeGuard),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected defaultPriceMode = inject('SCOS_PRICE_MODE')
  ) {}

  get(): Observable<string> {
    return this.activePriceMode$;
  }

  set(priceMode: string): void {
    const prev = this.activePriceMode$.value;
    this.activePriceMode$.next(priceMode);

    // console.log('guard', this.priceModeGuard.isAllowed());

    if (prev !== priceMode) {
      // depending on the guard value
      this.queryService.emit({ type: PriceModeChanged, data: priceMode });
    }
  }
}
