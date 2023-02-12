import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { AddressForm } from '@spryker-oryx/user/address-form';
import { Observable } from 'rxjs';
import { AddressFormQualifier } from '../../models';
import { AddressFormAdapter } from './address-form.adapter';

export class DefaultAddressFormAdapter implements AddressFormAdapter {
  constructor(protected httpService = inject(HttpService)) {}

  get(qualifier: AddressFormQualifier): Observable<AddressForm> {
    return this.httpService.get<AddressForm>(
      `${location.origin}/assets/addresses/${qualifier.country}.json`
    );
  }
}
