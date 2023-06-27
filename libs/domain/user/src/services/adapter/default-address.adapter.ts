import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, of, switchMap, take } from 'rxjs';
import { Address } from '../../models';
import { AddressAdapter, AddressRequestProps } from './address.adapter';
import { AddressesNormalizer, AddressNormalizer } from './normalizers';
import { AddressSerializer } from './serializers';

export class DefaultAddressAdapter implements AddressAdapter {
  constructor(
    protected identityService = inject(IdentityService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected httpService = inject(HttpService)
  ) {}

  getList(): Observable<Address[]> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity) => {
        if (!identity.isAuthenticated || !identity.userId) {
          return of([]);
        }

        return this.httpService
          .get(this.generateUrl(identity.userId))
          .pipe(this.transformer.do(AddressesNormalizer));
      })
    );
  }

  add(data: Address): Observable<Address> {
    return this.modify(data, ({ payload, identity }) =>
      this.httpService.post(this.generateUrl(identity.userId!), payload)
    );
  }

  update(data: Address): Observable<Address> {
    return this.modify(data, ({ payload, identity }) =>
      this.httpService.patch(
        this.generateUrl(identity.userId!, data.id),
        payload
      )
    );
  }

  delete(data: Address): Observable<unknown> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity) =>
        !identity.isAuthenticated || !identity.userId
          ? of(false)
          : this.httpService.delete(this.generateUrl(identity.userId, data.id))
      )
    );
  }

  protected modify(
    data: Address,
    request: (props: AddressRequestProps) => Observable<unknown>
  ): Observable<Address> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity) => {
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
