import {
  HttpService,
  IdentityService,
  JsonAPITransformerService,
  TransformerService,
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
    protected jsonTransformer = inject(JsonAPITransformerService),
    protected transformer = inject(TransformerService),
    protected identity = inject(IdentityService)
  ) {}

  get(props: GetCheckoutDataProps): Observable<CheckoutData> {
    return this.transformer
      .transform<ApiCheckoutModel.Payload, GetCheckoutDataProps>(
        props,
        CheckoutSerializers
      )
      .pipe(
        switchMap((data) => this.post(data, props.include)),
        switchMap((response: ApiCheckoutModel.Response) =>
          this.jsonTransformer.transform<CheckoutData>(
            response,
            CheckoutNormalizers
          )
        )
      );
  }

  update(props: UpdateCheckoutDataProps): Observable<CheckoutData> {
    return this.transformer
      .transform<ApiCheckoutModel.Payload, UpdateCheckoutDataProps>(
        props,
        CheckoutSerializers
      )
      .pipe(
        switchMap((data) => this.post(data, props.include)),
        switchMap((response: ApiCheckoutModel.Response) =>
          this.jsonTransformer.transform<CheckoutData>(
            response,
            CheckoutNormalizers
          )
        )
      );
  }

  protected post(
    data: ApiCheckoutModel.Payload,
    include?: ApiCheckoutModel.Includes[]
  ): Observable<ApiCheckoutModel.Response> {
    return this.identity
      .getHeaders()
      .pipe(
        switchMap((headers) =>
          this.http.post<ApiCheckoutModel.Response>(
            this.generateUrl(include),
            data,
            { headers }
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
