import { Identity, IdentityService } from '@spryker-oryx/auth';
import {
  HttpService,
  JsonAPITransformerService,
  StorageService,
  StorageType,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Address } from '../../models';
import { AddressAdapter, AddressRequestProps } from './address.adapter';
import { AddressesNormalizer, AddressNormalizer } from './normalizers';
import { AddressSerializer } from './serializers';

export class DefaultAddressAdapter implements AddressAdapter {
  protected CURRENT_ADDRESS = 'address';

  constructor(
    protected identityService = inject(IdentityService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected storage = inject(StorageService),
    protected httpService = inject(HttpService)
  ) {}

  getAll(): Observable<Address[]> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity: Identity) => {
        if (identity.anonymous) {
          return this.storage
            .get<Address | null>(this.CURRENT_ADDRESS, StorageType.SESSION)
            .pipe(
              map((address) => {
                if (address) {
                  return [address];
                }
                return [];
              })
            );
        }

        return this.httpService
          .get(this.generateUrl(identity.id))
          .pipe(this.transformer.do(AddressesNormalizer));
      })
    );
  }

  add(data: Address): Observable<Address> {
    return this.modify(data, ({ payload, identity }) =>
      this.httpService.post(this.generateUrl(identity.id), payload)
    );
  }

  update(data: Address): Observable<Address> {
    return this.modify(data, ({ payload, identity }) =>
      this.httpService.patch(this.generateUrl(identity.id, data.id), payload)
    );
  }

  delete(data: Address): Observable<Address> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity: Identity) =>
        (identity.anonymous
          ? this.storage.remove(this.CURRENT_ADDRESS, StorageType.SESSION)
          : this.httpService.delete(this.generateUrl(identity.id, data.id))
        ).pipe(switchMap(() => of(data)))
      )
    );
  }

  clear(): Observable<void> {
    this.storage.remove(this.CURRENT_ADDRESS, StorageType.SESSION);
    return of(undefined);
  }

  protected modify(
    data: Address,
    request: (props: AddressRequestProps) => Observable<unknown>
  ): Observable<Address> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity: Identity) => {
        if (identity.anonymous) {
          data.isDefaultBilling = true;
          data.isDefaultShipping = true;
          this.storage.set(this.CURRENT_ADDRESS, data, StorageType.SESSION);
          return of(data);
        }

        return this.transformer.serialize(data, AddressSerializer).pipe(
          switchMap((serializedData) => {
            return request({ payload: serializedData, identity }).pipe(
              this.transformer.do(AddressNormalizer)
            );
          })
        );
      })
    );
  }

  protected generateUrl(id: string, address?: string | null): string {
    return `${this.SCOS_BASE_URL}/customers/${id}/addresses${
      address ? `/${address}` : ''
    }`;
  }
}
