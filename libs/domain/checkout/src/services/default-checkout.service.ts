import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Checkout, CheckoutProcessState, CheckoutResponse } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutService } from './checkout.service';

// consider moving out steps, register and collect to CheckoutOrchestratorService
// we'd keep register here as a proxy to "hide" the orchestrator from the components
export class DefaultCheckoutService<T extends Checkout>
  implements CheckoutService<T>
{
  protected state = new BehaviorSubject(CheckoutProcessState.Initializing);

  protected steps: Array<{
    id: keyof T;
    collectDataCallback: () => Observable<T[keyof T]>;
    order?: number;
  }> = [];

  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected linkService = inject(SemanticLinkService)
  ) {}

  register<K extends keyof T>(
    id: K,
    collectDataCallback: () => Observable<T[K]>,
    sort?: number
  ): void {
    const step = this.steps.find((step) => step.id === id);
    if (step) {
      if (collectDataCallback !== undefined)
        step.collectDataCallback = collectDataCallback;
      if (sort !== undefined) step.order = sort;
    } else {
      this.steps.push({
        id,
        collectDataCallback: collectDataCallback,
        order: sort,
      });
    }
    this.steps.sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER)
    );
  }

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
    this.state.next(CheckoutProcessState.Busy);
    return subscribeReplay(
      this.collect().pipe(
        catchError((error) => {
          this.state.next(CheckoutProcessState.Ready);
          return EMPTY;
        }),
        switchMap((data: Checkout) => {
          const attributes = this.amendCheckoutData(data);
          return this.adapter.placeOrder({ attributes }).pipe(
            finalize(() => {
              this.state.next(CheckoutProcessState.Ready);
              return EMPTY;
            })
          );
        }),
        switchMap(this.resolveRedirect),
        tap((response) => this.postCheckout(response))
      )
    );
  }

  protected collect(): Observable<T> {
    if (this.steps.length === 0) {
      throw new Error('No steps registered');
    }

    const collectStep = (
      index: number,
      collectedData: Partial<T>
    ): Observable<T> => {
      const { id, collectDataCallback: callback } = this.steps[index];
      return callback().pipe(
        switchMap((value) => {
          if (value === null) {
            throw new Error(`No data collected for step '${String(id)}'`);
          }
          collectedData[id] = value;
          if (index === this.steps.length - 1) return of(collectedData as T);
          return collectStep(index + 1, collectedData);
        })
      );
    };

    return collectStep(0, {});
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
      console.log('TODO: store last order', response.orders[0]);
      // this.orderService.storeLastOrder(response.orders[0]);
    }
  }

  /**
   * Temporary solution
   */
  protected amendCheckoutData(data: Checkout): Checkout {
    const attributes = {
      ...data,
    };
    if (attributes.shippingAddress) {
      // temporarily till we add billingAddress component
      attributes.billingAddress = attributes.shippingAddress;
    }
    if (
      !attributes.customer.salutation &&
      attributes.shippingAddress?.salutation
    ) {
      attributes.customer.salutation = attributes.shippingAddress?.salutation;
    }
    return attributes;
  }
}
