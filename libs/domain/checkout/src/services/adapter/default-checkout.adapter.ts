import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, switchMap } from 'rxjs';
import { ApiCheckoutModel, CheckoutData, CheckoutResponse } from '../../models';
import {
  CheckoutAdapter,
  GetCheckoutDataProps,
  PostCheckoutProps,
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

  placeOrder(props: PostCheckoutProps): Observable<CheckoutResponse> {
    return this.transformer
      .serialize(props, CheckoutSerializer)
      .pipe(
        switchMap((data) =>
          this.http
            .post<ApiCheckoutModel.CheckoutResponse>(
              `${this.SCOS_BASE_URL}/checkout`,
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

  protected generateUrl(include?: ApiCheckoutModel.Includes[]): string {
    return `${this.SCOS_BASE_URL}/checkout-data${
      include ? `?include=${include.join(',')}` : ''
    }`;
  }
}
