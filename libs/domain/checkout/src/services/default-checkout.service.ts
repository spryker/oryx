import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { BehaviorSubject, EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { CheckoutProcessState, CheckoutResponse } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutService } from './checkout.service';

export class DefaultCheckoutService implements CheckoutService {
  protected state = new BehaviorSubject(CheckoutProcessState.Initializing);

  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected linkService = inject(SemanticLinkService),
    protected orderService = inject(OrderService)
  ) {}

  /**
   * @override when there are not items in cart, the state will always become
   * `CheckoutProcessState.NotAvailable`.
   */
  getProcessState(): Observable<CheckoutProcessState> {
    return this.cartService
      .isEmpty()
      .pipe(
        switchMap((isEmpty) =>
          this.state.pipe(
            map((state) =>
              isEmpty ? CheckoutProcessState.NotAvailable : state
            )
          )
        )
      );
  }

  placeOrder(): Observable<CheckoutResponse> {
    this.state.next(CheckoutProcessState.Validate);

    // TODO: observe checkout data, then move to ready or done
    setTimeout(() => this.state.next(CheckoutProcessState.Ready), 500);
    return EMPTY;
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
   * Clears the cart, stores the order in memory.
   */
  protected postCheckout(response: CheckoutResponse): void {
    this.cartService.reload();
    if (response.orders) {
      this.orderService.storeLastOrder(response.orders[0]);
    }
  }

  /**
   * Temporary solution
   */
  // protected amendCheckoutData(data: Checkout): Checkout {
  //   const attributes = {
  //     ...data,
  //   };
  //   if (attributes.shippingAddress) {
  //     // temporarily till we add billingAddress component
  //     attributes.billingAddress = attributes.shippingAddress;
  //   }
  //   if (
  //     !attributes.customer?.salutation &&
  //     attributes.shippingAddress?.salutation
  //   ) {
  //     attributes.customer.salutation = attributes.shippingAddress?.salutation;
  //   }
  //   return attributes;
  // }
}
