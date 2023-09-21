import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, combineLatest, map, switchMap, take } from 'rxjs';

/* deprecated since 1.1, we should use imports from @spryker-oryx/checkout:
import {
  ApiCheckoutModel,
  CheckoutAdapter,
  CheckoutData,
  CheckoutDataSerializer,
  CheckoutNormalizer,
  CheckoutResponse,
  CheckoutResponseNormalizer,
  CheckoutSerializer,
  PlaceOrderData,
} from '@spryker-oryx/checkout';
 */
import {
  ApiCheckoutModel,
  CheckoutData,
  CheckoutResponse,
  PlaceOrderData,
} from '../../../src/models';
import {
  CheckoutAdapter,
  CheckoutDataSerializer,
  CheckoutNormalizer,
  CheckoutResponseNormalizer,
  CheckoutSerializer,
} from '../../../src/services';

export class DefaultCheckoutAdapter implements CheckoutAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService)
  ) {}

  get(props: PlaceOrderData): Observable<CheckoutData> {
    return this.transformer.serialize(props, CheckoutDataSerializer).pipe(
      switchMap((data) =>
        this.http
          .post<ApiCheckoutModel.CheckoutResponse>(this.generateUrl(), data)
          .pipe(
            this.transformer.do(CheckoutNormalizer),
            map((data) => {
              // Workaround for shipmentTotals = 0
              // if we do not submit shipment method, we don't want to have shipment totals in the response
              // as we can't recognize if shipment is calculated or not in case if it's zero
              if (
                !props.shipment?.idShipmentMethod &&
                !data?.carts?.[0]?.totals?.shipmentTotal
              ) {
                delete data?.carts?.[0]?.totals?.shipmentTotal;
              }
              return data;
            })
          )
      )
    );
  }

  placeOrder(data: PlaceOrderData): Observable<CheckoutResponse> {
    return combineLatest([
      this.identity.get(),
      this.transformer.serialize(data, CheckoutSerializer),
    ]).pipe(
      take(1),
      switchMap(([user, data]) =>
        this.http
          .post<ApiCheckoutModel.CheckoutResponse>(
            `${this.SCOS_BASE_URL}/checkout${
              !user.isAuthenticated ? '?include=orders' : ''
            }`,
            data
          )
          .pipe(this.transformer.do(CheckoutResponseNormalizer))
      )
    );
  }

  protected generateUrl(
    include: ApiCheckoutModel.Includes[] = [
      ApiCheckoutModel.Includes.Shipments,
      ApiCheckoutModel.Includes.ShipmentMethods,
      ApiCheckoutModel.Includes.PaymentMethods,
      ApiCheckoutModel.Includes.Carts,
      ApiCheckoutModel.Includes.GuestCarts,
    ]
  ): string {
    return `${this.SCOS_BASE_URL}/checkout-data${
      include ? `?include=${include.join(',')}` : ''
    }`;
  }
}
