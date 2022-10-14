import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { AddressForm } from '../../../address-form';
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
