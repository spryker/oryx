import { ErrorService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { AddressForm } from '@spryker-oryx/user/address-form';
import { catchError, Observable, of, switchMap } from 'rxjs';
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
      switchMap((response) => {
        if (!response?.id) {
          throw new Error();
        }

        return of(response);
      }),
      catchError(() => {
        return qualifier.fallbackCountry
          ? this.adapter.get({ country: qualifier.fallbackCountry }).pipe(
              switchMap((response) => {
                if (!response.id) {
                  return this.handlerError();
                }

                return of(response);
              }),
              catchError(() => {
                return this.handlerError();
              })
            )
          : this.handlerError();
      })
    );
  }

  private handlerError(): Observable<null> {
    const errorEvent = new ErrorEvent('error', {
      message:
        'We could not load the address form details for the given country.',
    });

    this.errorService.dispatchError(errorEvent);

    return of(null);
  }
}
