import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, switchMap } from 'rxjs';
import { ApiCheckoutModel, CheckoutData } from '../../models';
import {
  CheckoutAdapter,
  GetCheckoutDataProps,
  PostCheckoutProps,
  UpdateCheckoutDataProps,
} from './checkout.adapter';
import { CheckoutNormalizer } from './normalizers';
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

  placeOrder(props: PostCheckoutProps): Observable<CheckoutData> {
    return this.transformer
      .serialize(props, CheckoutSerializer)
      .pipe(
        switchMap((data) =>
          this.http
            .post<ApiCheckoutModel.Response>(
              `${this.SCOS_BASE_URL}/checkout`,
              data
            )
            .pipe(this.transformer.do(CheckoutNormalizer))
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
            .post<ApiCheckoutModel.Response>(
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
