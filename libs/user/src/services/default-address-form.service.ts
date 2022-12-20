import { ErrorService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { catchError, Observable, of } from 'rxjs';
import { AddressForm } from '../../address-form';
import { AddressFormQualifier } from '../models';
import { AddressFormAdapter } from './adapter';
import { AddressFormService } from './address-form.service';

export class DefaultAddressFormService implements AddressFormService {
  constructor(
    protected adapter = inject(AddressFormAdapter),
    protected errorService = inject(ErrorService)
  ) {}

  getForm(qualifier: AddressFormQualifier): Observable<AddressForm | null> {
    return this.adapter.get(qualifier).pipe(
      catchError(() => {
        //TODO - still under consideration
        /*
        if (e.status !== 404) {
          return of(null);
        }
        */
        const error = new ErrorEvent('error', {
          message:
            'We could not load the address form details for the given country.',
        });
        this.errorService.dispatchError(error);

        return of(null);
      })
    );
  }
}
