import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { combineLatest, Observable, switchMap, take } from 'rxjs';
import {
  ApiCheckoutModel,
  CheckoutData,
  CheckoutResponse,
  PlaceOrderData,
} from '../../models';
import {
  CheckoutAdapter,
  GetCheckoutDataProps,
  UpdateCheckoutDataProps,
} from './checkout.adapter';
import { CheckoutNormalizer, CheckoutResponseNormalizer } from './normalizers';
import { CheckoutDataSerializer, CheckoutSerializer } from './serializers';

export class DefaultCheckoutAdapter implements CheckoutAdapter {
  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected identity = inject(IdentityService)
  ) {}

  get(props: GetCheckoutDataProps): Observable<CheckoutData> {
    return this.post(props);
  }

  update(props: UpdateCheckoutDataProps): Observable<CheckoutData> {
    return this.post(props);
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

  protected post(
    props: GetCheckoutDataProps | UpdateCheckoutDataProps
  ): Observable<CheckoutData> {
    return this.transformer
      .serialize(props, CheckoutDataSerializer)
      .pipe(
        switchMap((data) =>
          this.http
            .post<ApiCheckoutModel.CheckoutResponse>(
              this.generateUrl(props.include),
              data
            )
            .pipe(this.transformer.do(CheckoutNormalizer))
        )
      );
  }

  protected generateUrl(
    include: ApiCheckoutModel.Includes[] = [
      ApiCheckoutModel.Includes.Shipments,
      ApiCheckoutModel.Includes.ShipmentMethods,
      ApiCheckoutModel.Includes.PaymentMethods,
    ]
  ): string {
    return `${this.SCOS_BASE_URL}/checkout-data${
      include ? `?include=${include.join(',')}` : ''
    }`;
  }
}
