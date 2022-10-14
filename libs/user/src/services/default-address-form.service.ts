import { inject } from '@spryker-oryx/injector';
import { Observable } from 'rxjs';
import { AddressForm } from '../../address-form';
import { AddressFormQualifier } from '../models';
import { AddressFormAdapter } from './adapter';
import { AddressFormService } from './address-form.service';

export class DefaultAddressFormService implements AddressFormService {
  constructor(protected adapter = inject(AddressFormAdapter)) {}

  getForm(qualifier: AddressFormQualifier): Observable<AddressForm> {
    return this.adapter.get(qualifier);
  }
}
