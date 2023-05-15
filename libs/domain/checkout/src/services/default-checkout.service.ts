import { CartService } from '@spryker-oryx/cart';
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
import { CheckoutService } from './checkout.service';
import { CheckoutDataService } from './data';
import { CheckoutStateService } from './state';

export class DefaultCheckoutService implements CheckoutService {
  protected cartId = this.cartService.getCart({}).pipe(
    map((cart) => cart?.id),
    tap((cartId) => {
      const data = cartId ?? null;
      this.stateService.set('cartId', !!data, data);
    })
  );

  protected process = new BehaviorSubject(CheckoutState.Ready);
  protected process$ = this.cartId
    .pipe(map((cartId) => !!cartId))
    .pipe(
      switchMap((hasCart) => (hasCart ? this.process : of(CheckoutState.Empty)))
    );

  constructor(
    protected dataService = inject(CheckoutDataService),
    protected stateService = inject(CheckoutStateService),
    protected adapter = inject(CheckoutAdapter),
    protected linkService = inject(SemanticLinkService),
    protected orderService = inject(OrderService),
    protected cartService = inject(CartService)
  ) {}

  getProcessState(): Observable<CheckoutState> {
    return this.process$;
  }

  placeOrder(): Observable<CheckoutResponse> {
    this.process.next(CheckoutState.Busy);
    return subscribeReplay(
      this.stateService.getAll().pipe(
        take(1),
        switchMap((data) => {
          console.log('place order', data);
          if (data) {
            return this.adapter
              .placeOrder({ attributes: data as Checkout })
              .pipe(
                switchMap((response) => this.resolveRedirect(response)),
                tap((response) => this.postCheckout(response)),
                finalize(() => this.process.next(CheckoutState.Ready))
              );
          } else {
            this.process.next(CheckoutState.Invalid);
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
    this.stateService.clear();
    this.cartService.reload();
    if (response.orders?.length)
      this.orderService.storeLastOrder(response.orders[0]);
  }
}
