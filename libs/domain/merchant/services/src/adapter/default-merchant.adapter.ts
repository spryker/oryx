import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  ApiMerchantModel,
  Merchant,
  MerchantAdapter,
  MerchantListNormalizer,
  MerchantListQualifier,
  MerchantNormalizer,
  MerchantQualifier,
} from '@spryker-oryx/merchant';
import { Observable } from 'rxjs';

export class DefaultMerchantAdapter implements MerchantAdapter {
  protected merchantEndpoint = 'merchants';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  get({ id }: MerchantQualifier): Observable<Merchant> {
    const includes = ['merchant-opening-hours', 'merchant-addresses'];
    return this.http
      .get<ApiMerchantModel.Merchant>(
        `${this.SCOS_BASE_URL}/${this.merchantEndpoint}/${id}${
          includes?.length ? '?include=' : ''
        }${includes?.join(',') || ''}`
      )
      .pipe(this.transformer.do(MerchantNormalizer));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getList(qualifier?: MerchantListQualifier): Observable<Merchant[]> {
    return this.http
      .get<ApiMerchantModel.Merchant[]>(
        `${this.SCOS_BASE_URL}/${this.merchantEndpoint}`
      )
      .pipe(this.transformer.do(MerchantListNormalizer));
  }
}
