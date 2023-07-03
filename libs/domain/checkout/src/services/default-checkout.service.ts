import { CartService, CartsUpdated } from '@spryker-oryx/cart';
import { createCommand, createEffect } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { AddressModificationSuccess } from '@spryker-oryx/user';
import {
  combineLatest,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  startWith,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { CheckoutResponse, CheckoutStatus, PlaceOrderData } from '../models';
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

  protected isBusy$ = createEffect(({ getEvents }) =>
    getEvents([PlaceOrderStart, PlaceOrderEnd]).pipe(
      scan(
        (acc, event: PlaceOrderStart | PlaceOrderEnd) =>
          event.type === PlaceOrderStart ? ++acc : --acc,
        0
      ),
      map((x) => (x ? CheckoutStatus.Busy : CheckoutStatus.Ready)),
      startWith(CheckoutStatus.Ready)
    )
  ) as Observable<CheckoutStatus>;

  protected process$ = this.cartId$.pipe(
    switchMap((hasCart) => (hasCart ? this.isBusy$ : of(CheckoutStatus.Empty))),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected placeOrderCommand$ = createCommand({
    action: () => {
      return combineLatest([this.stateService.getAll(), this.cartId$]).pipe(
        take(1),
        switchMap(([state, cartId]) =>
          state && cartId
            ? this.adapter.placeOrder({
                ...state,
                cartId,
              } as PlaceOrderData)
            : throwError(() => new Error('Invalid checkout data'))
        ),
        switchMap((response) => this.resolveRedirect(response))
      );
    },
    onStart: [PlaceOrderStart],
    onFinish: [PlaceOrderEnd],
    onSuccess: [
      PlaceOrderSuccess,
      CartsUpdated,
      AddressModificationSuccess,
      ({ data }) => {
        if (data?.orders?.length)
          this.orderService.storeLastOrder(data.orders[0]);
      },
      () => this.stateService.clear(),
    ],
    onError: [PlaceOrderFail],
  });

  constructor(
    protected stateService = inject(CheckoutStateService),
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected linkService = inject(SemanticLinkService),
    protected orderService = inject(OrderService)
  ) {}

  getStatus(): Observable<CheckoutStatus> {
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
}
