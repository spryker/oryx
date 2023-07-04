import { IdentityService } from '@spryker-oryx/auth';
import { createCommand, createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { map, Observable, skip } from 'rxjs';
import { Address } from '../models';
import { AddressAdapter } from './adapter';
import { AddressService } from './address.service';
import { AddressModificationSuccess } from './state';

export class DefaultAddressService implements AddressService {
  protected addressesQuery$ = createQuery({
    loader: () =>
      this.adapter.getList().pipe(map((addresses) => addresses ?? [])),
    resetOn: [this.identity.get().pipe(skip(1))],
    refreshOn: [AddressModificationSuccess],
  });

  protected currentAddress$ = this.addressesQuery$
    .get()
    .pipe(
      map(
        (addresses) =>
          addresses?.find(
            (address) => address.isDefaultBilling || address.isDefaultShipping
          ) ?? null
      )
    );

  constructor(
    protected adapter = inject(AddressAdapter),
    protected identity = inject(IdentityService)
  ) {}

  getCurrent(): Observable<Address | null> {
    return this.currentAddress$;
  }

  get(addressId: string): Observable<Address | null> {
    return this.getList().pipe(
      map((addresses) => addresses?.find(({ id }) => id === addressId) ?? null)
    );
  }

  getList(): Observable<Address[] | undefined> {
    return this.addressesQuery$.get();
  }

  protected addAddressCommand$ = createCommand({
    onSuccess: [AddressModificationSuccess],
    action: (qualifier: Address) => {
      return this.adapter.add(qualifier);
    },
  });

  protected updateAddressCommand$ = createCommand({
    onSuccess: [AddressModificationSuccess],
    action: (qualifier: Address) => {
      return this.adapter.update(qualifier);
    },
  });

  protected deleteAddressCommand$ = createCommand({
    onSuccess: [AddressModificationSuccess],
    action: (qualifier: Address) => {
      return this.adapter.delete(qualifier);
    },
  });

  add(data: Address): Observable<unknown> {
    return this.addAddressCommand$.execute(data);
  }

  update(data: Address): Observable<unknown> {
    return this.updateAddressCommand$.execute(data);
  }

  delete(data: Address): Observable<unknown> {
    return this.deleteAddressCommand$.execute(data);
  }
}
