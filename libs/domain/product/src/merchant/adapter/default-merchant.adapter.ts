import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { ApiProductModel } from '../../models';
import { Merchant, MerchantQualifier } from '../models';
import { MerchantAdapter, MerchantNormalizer } from './merchant.adapter';

export class DefaultMerchantAdapter implements MerchantAdapter {
  protected merchantEndpoint = 'merchants';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  get({ id }: MerchantQualifier): Observable<Merchant> {
    return this.http
      .get<ApiProductModel.Merchant>(
        `${this.SCOS_BASE_URL}/${this.merchantEndpoint}/${id}`
      )
      .pipe(this.transformer.do(MerchantNormalizer));
  }
}
