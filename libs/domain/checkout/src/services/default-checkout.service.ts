import { CartService } from '@spryker-oryx/cart';
import { createCommand, createEffect, QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { AddressModificationSuccess } from '@spryker-oryx/user';
import {
  map,
  Observable,
  of,
  scan,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { CheckoutResponse, CheckoutState, PlaceOrderData } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutService } from './checkout.service';
import {
  CheckoutStateService,
  PlaceOrderEnd,
  PlaceOrderFail,
  PlaceOrderStart,
  PlaceOrderSuccess,
} from './state';

export class DefaultCheckoutService implements CheckoutService {
  protected cartId$ = this.cartService
    .getCart({})
    .pipe(map((cart) => cart?.id));

  protected process$ = this.cartId$.pipe(
    tap((cartId) =>
      this.stateService.set('cartId', {
        valid: !!cartId,
        value: cartId ?? null,
      })
    ),
    switchMap((hasCart) => (hasCart ? this.isBusy$ : of(CheckoutState.Empty)))
  );

  protected isBusy$ = createEffect(({ getEvents }) =>
    getEvents([PlaceOrderStart, PlaceOrderEnd]).pipe(
      scan(
        (acc, event: PlaceOrderStart | PlaceOrderEnd) =>
          event.type === PlaceOrderStart ? ++acc : --acc,
        0
      ),
      map((x) => (x ? CheckoutState.Busy : CheckoutState.Ready))
    )
  ) as Observable<CheckoutState>;

  protected placeOrderCommand$ = createCommand({
    action: () => {
      return this.stateService.getAll().pipe(
        take(1),
        switchMap((state) =>
          state
            ? this.adapter.placeOrder(state as PlaceOrderData)
            : throwError(() => new Error('Invalid checkout data'))
        ),
        switchMap((response) => this.resolveRedirect(response)),
        tap((response) => this.postCheckout(response))
      );
    },
    onStart: [PlaceOrderStart],
    onFinish: [PlaceOrderEnd],
    onSuccess: [PlaceOrderSuccess],
    onError: [PlaceOrderFail],
  });

  constructor(
    protected stateService = inject(CheckoutStateService),
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected linkService = inject(SemanticLinkService),
    protected orderService = inject(OrderService),
    protected queryService = inject(QueryService)
  ) {}

  getProcessState(): Observable<CheckoutState> {
    return this.process$;
  }

  placeOrder(): Observable<CheckoutResponse> {
    return this.placeOrderCommand$.execute();
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
   * After placing the order we need to do some cleanup:
   * - clear the checkout state
   * - clear the cart
   * - store the placed order
   */
  protected postCheckout(response: CheckoutResponse): void {
    this.stateService.clear();
    this.cartService.reload();
    if (response.orders?.length)
      this.orderService.storeLastOrder(response.orders[0]);
    // We want to reload addresses after checkout, as new address may have been created
    // This one will be part of command success event, but for now we need to emit it manually
    this.queryService.emit({ type: AddressModificationSuccess });
  }
}
