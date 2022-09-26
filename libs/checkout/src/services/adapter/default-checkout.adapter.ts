import {
  HttpService,
  IdentityService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, switchMap } from 'rxjs';
import { ApiCheckoutModel, CheckoutData } from '../../models';
import {
  CheckoutAdapter,
  GetCheckoutDataProps,
  UpdateCheckoutDataProps,
} from './checkout.adapter';
import { CheckoutNormalizers } from './normalizers';
import { CheckoutSerializers } from './serializers';

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

  protected post(
    props: GetCheckoutDataProps | UpdateCheckoutDataProps
  ): Observable<CheckoutData> {
    return this.transformer.serialize(props, CheckoutSerializers).pipe(
      switchMap((data) =>
        this.identity.getHeaders().pipe(
          switchMap((headers) =>
            this.http
              .post<ApiCheckoutModel.Response>(
                this.generateUrl(props.include),
                data,
                {
                  headers,
                }
              )
              .pipe(this.transformer.do(CheckoutNormalizers))
          )
        )
      )
    );
  }

  protected generateUrl(include?: ApiCheckoutModel.Includes[]): string {
    return `${this.SCOS_BASE_URL}/checkout-data${
      include ? `?include=${include.join(',')}` : ''
    }`;
  }
}
