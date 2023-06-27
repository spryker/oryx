import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { LitElement, ReactiveController } from 'lit';
import {
  combineLatest,
  defer,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import {
  CartDiscount,
  FormattedDiscount,
  FormattedTotals,
  NormalizedTotals,
} from '../models';
import {
  TotalsContext,
  TotalsContextData,
  TotalsService,
} from '../services/totals/totals.service';

export class TotalsController implements ReactiveController {
  protected context: ContextController;

  protected pricingService = resolve(PricingService);

  constructor(protected host: LitElement) {
    this.host.addController(this);
    this.context = new ContextController(host);
  }

  hostDisconnected?(): void;

  protected getReference(ref: string): string {
    return `${TotalsService}${ref}`;
  }

  protected formatDiscounts(
    discounts?: CartDiscount[],
    currency?: string
  ): Observable<FormattedDiscount[] | null> {
    return of(discounts).pipe(
      switchMap((discounts) =>
        discounts
          ? (combineLatest(
              discounts.map(({ amount, ...discount }) =>
                this.pricingService.format(-amount, currency).pipe(
                  map((amount) => ({ ...discount, amount })),
                  filter(({ amount }) => amount !== null)
                )
              )
            ) as Observable<FormattedDiscount[]>)
          : of(null)
      )
    );
  }

  provideContext(context: TotalsContextData): void {
    this.context.provide(TotalsContext.Reference, context);
  }

  getTotals(): Observable<NormalizedTotals | null> {
    return defer(() =>
      this.context.get<TotalsContextData>(TotalsContext.Reference).pipe(
        switchMap((totalsContext) => {
          if (!totalsContext) return of(null);
          const { context, ...data } = totalsContext;
          const quantifier = Object.keys(data).length ? data : undefined;
          return (
            resolve(this.getReference(context)) as TotalsService
          ).getTotals(quantifier);
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      )
    );
  }

  getFormattedTotals(): Observable<FormattedTotals | null> {
    return this.getTotals().pipe(
      switchMap((totals) =>
        totals
          ? Object.entries(totals).reduce((acc$, [key, value]) => {
              return acc$.pipe(
                switchMap((acc) => {
                  if (!value) {
                    return of(acc);
                  } else if (typeof value === 'string') {
                    return of({ ...acc, [key]: value });
                  } else if (key === 'discounts') {
                    return this.formatDiscounts(value, totals.currency).pipe(
                      map((discounts) => ({ ...acc, discounts }))
                    );
                  } else if (key === 'discountTotal') {
                    value = -value;
                  }

                  return this.pricingService
                    .format(value, totals.currency)
                    .pipe(
                      map((formattedPrice) => ({
                        ...acc,
                        [key]: formattedPrice as string,
                      }))
                    );
                })
              );
            }, of({}))
          : of(null)
      )
    );
  }
}
