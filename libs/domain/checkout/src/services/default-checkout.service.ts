import { inject } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Checkout, CheckoutResponse, CheckoutState } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutDataService } from './checkout-data.service';
import { CheckoutService } from './checkout.service';

export class DefaultCheckoutService implements CheckoutService {
  protected state = new BehaviorSubject(CheckoutState.Ready);
  protected state$ = this.dataService
    .isReady()
    .pipe(
      switchMap((isReady) => (isReady ? this.state : of(CheckoutState.Empty)))
    );

  constructor(
    protected dataService = inject(CheckoutDataService),
    protected adapter = inject(CheckoutAdapter),
    protected linkService = inject(SemanticLinkService),
    protected orderService = inject(OrderService)
  ) {}

  getState(): Observable<CheckoutState> {
    return this.state$;
  }

  placeOrder(): Observable<CheckoutResponse> {
    this.state.next(CheckoutState.Busy);
    return subscribeReplay(
      this.dataService.collect().pipe(
        take(1),
        switchMap((data) => {
          if (data) {
            return this.adapter
              .placeOrder({ attributes: data as Checkout })
              .pipe(
                switchMap((response) => this.resolveRedirect(response)),
                tap((response) => {
                  this.postCheckout(response);
                  this.dataService.clear();
                }),
                finalize(() => this.state.next(CheckoutState.Ready))
              );
          } else {
            this.state.next(CheckoutState.Invalid);
            return EMPTY;
          }
        })
      )
    );
  }

  protected resolveRedirect(
    response: CheckoutResponse
  ): Observable<CheckoutResponse> {
    return response.redirectUrl
      ? of(response)
      : this.linkService
          .get({
            type: SemanticLinkType.Order,
            id: response.orderReference,
          })
          .pipe(map((redirectUrl) => ({ ...response, redirectUrl })));
  }

  /**
   * Stores the order in memory.
   *
   * TOOD: consider doing this in a lower layer.
   */
  protected postCheckout(response: CheckoutResponse): void {
    if (response.orders?.length)
      this.orderService.storeLastOrder(response.orders[0]);
  }
}
