import { CartService } from '@spryker-oryx/cart';
import { inject, resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  combineLatest,
  concat,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  Checkout,
  CheckoutResponse,
  ContactDetails,
  Validity,
} from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutDataService } from './checkout-data.service';
import { CheckoutOrchestrationService } from './checkout-orchestration.service';
import { CheckoutService } from './checkout.service';

export class DefaultCheckoutService implements CheckoutService {
  constructor(
    protected orchestrationService = inject(CheckoutOrchestrationService),
    protected dataService = inject(CheckoutDataService),
    protected adapter = inject(CheckoutAdapter),
    protected cartService = inject(CartService),
    protected semanticLink = inject(SemanticLinkService),
    protected router = resolve(RouterService)
  ) {}

  protected canCheckout$ = this.orchestrationService.getValidity().pipe(
    map(
      (validity) =>
        !validity.some(({ validity }) => validity === Validity.Invalid)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  canCheckout(): Observable<boolean> {
    return this.canCheckout$;
  }

  placeOrder(): Observable<CheckoutResponse> {
    return subscribeReplay(
      this.orchestrationService.submit().pipe(
        map(
          (validity) =>
            !validity.some(({ validity }) => validity === Validity.Invalid)
        ),
        switchMap((canCheckout) =>
          canCheckout
            ? this.preparePayload()
            : throwError(() => new Error('Cannot checkout'))
        ),
        switchMap((payload) =>
          this.adapter.placeOrder({ attributes: payload })
        ),
        tap((response) => this.postCheckout(response))
      )
    );
  }

  protected getCustomer(): Observable<ContactDetails | null> {
    return concat(
      this.dataService.getCustomer().pipe(take(1), filter(Boolean)),
      // TODO: Workaround for the case when customer is not set in the data service
      // Proper implementation should get customer data from the UserService.
      of({
        email: 'temporary-email@temporary-workaround.com',
      })
    ).pipe(take(1));
  }

  protected preparePayload(): Observable<Checkout> {
    return combineLatest([
      this.cartService.getCart().pipe(map((cart) => cart?.id)),
      this.getCustomer(),
      this.dataService.getAddress(),
      this.dataService.getShipment(),
      this.dataService.getPayment(),
    ]).pipe(
      take(1),
      map(([cartId, customer, billingAddress, shipment, payment]) => {
        const payload: Checkout = {
          cartId: cartId!,
          customer: {
            ...customer!,
            salutation:
              customer?.salutation ?? billingAddress!.salutation ?? '',
          },
          billingAddress: {
            ...billingAddress!,
          },
        };

        if (shipment?.idShipmentMethod) {
          payload.shipment = { idShipmentMethod: shipment.idShipmentMethod };
          payload.shippingAddress = { ...billingAddress! };
        }

        if (payment) {
          payload.payments = [payment];
        }

        return payload;
      })
    );
  }

  protected postCheckout(response: CheckoutResponse): Observable<unknown> {
    this.cartService.load();

    return subscribeReplay(
      this.semanticLink
        .get({ type: SemanticLinkType.Order, id: response.orderReference })
        .pipe(
          tap((url: string | undefined) => url && this.router.navigate(url))
        )
    );
  }
}
