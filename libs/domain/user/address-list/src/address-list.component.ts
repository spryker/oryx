import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { Address, AddressService } from '@spryker-oryx/user';
import {
  AddressDefaults,
  AddressListItemOptions,
} from '@spryker-oryx/user/address-list-item';
import {
  asyncValue,
  hydratable,
  i18n,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  ReplaySubject,
  tap,
} from 'rxjs';
import { SELECT_EVENT } from './address-list.model';
import { styles } from './address-list.styles';

@hydratable('window:load')
export class AddressListComponent extends ComponentMixin<AddressListItemOptions>() {
  static styles = styles;

  protected selectedAddress$ = new ReplaySubject<Address | null>(1);

  @subscribe()
  protected handle$ = this.selectedAddress$.pipe(
    tap((address) => {
      if (address) {
        this.dispatchEvent(
          new CustomEvent(SELECT_EVENT, {
            bubbles: true,
            composed: true,
            detail: { address },
          })
        );
      }
    }),
    distinctUntilChanged()
  );

  protected addresses$ = combineLatest([
    resolve(AddressService).getAddresses().pipe(distinctUntilChanged()),
    new ContentController(this).getOptions(),
  ]).pipe(
    tap(([addresses, options]) => {
      if (!options.selectable) {
        this.selectedAddress$.next(null);

        return;
      }

      const defaultAddress = addresses?.find((address) =>
        this.isDefault(address, options)
      );

      this.selectedAddress$.next(defaultAddress ?? addresses?.[0] ?? null);
    })
  );

  protected isDefault(
    address: Address,
    options: AddressListItemOptions
  ): boolean {
    const isDefault = options.addressDefaults === AddressDefaults.All;
    const isDefaultBilling =
      isDefault || options.addressDefaults === AddressDefaults.Billing;
    const isDefaultShipping =
      isDefault || options.addressDefaults === AddressDefaults.Shipping;

    return (
      !!(isDefaultShipping && address?.isDefaultShipping) ||
      !!(isDefaultBilling && address?.isDefaultBilling)
    );
  }

  protected data$ = combineLatest([
    this.addresses$,
    this.selectedAddress$,
  ]).pipe(
    map(
      ([addresses, selectedAddress]): [
        Address[] | null,
        Partial<AddressListItemOptions>,
        Address | null
      ] => [...addresses, selectedAddress]
    )
  );

  protected onChange(address: Address): void {
    this.selectedAddress$.next(address);
  }

  protected renderEmptyMessage(): TemplateResult {
    return html` <slot name="empty">
      <oryx-icon type="location" size="large"></oryx-icon>
      ${i18n('user.address.no-addresses')}
    </slot>`;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.data$,
      ([addresses, options, selectedAddress]) => {
        if (!addresses || !addresses.length) {
          return this.renderEmptyMessage();
        }

        return html`${repeat(
          addresses,
          (address) => address.id,
          (address) => {
            const selected = !!(
              options.selectable && selectedAddress?.id === address.id
            );

            return html`<oryx-tile ?selected=${selected}>
              <oryx-address-list-item
                .addressId=${address.id}
                .options=${options}
              >
                ${when(
                  options.selectable,
                  () => html`<input
                    name="address"
                    type="radio"
                    value="${address.id as string}"
                    ?checked=${selected}
                    @change=${() => this.onChange(address)}
                  />`
                )}
              </oryx-address-list-item>
            </oryx-tile>`;
          }
        )}`;
      }
    )}`;
  }
}
