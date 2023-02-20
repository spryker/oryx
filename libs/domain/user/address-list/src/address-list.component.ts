import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController, ContentMixin } from '@spryker-oryx/experience';
import { Address, AddressService } from '@spryker-oryx/user';
import {
  AddressDefaults,
  AddressListItemOptions,
} from '@spryker-oryx/user/address-list-item';
import {
  asyncState,
  asyncValue,
  hydratable,
  i18n,
  subscribe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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
export class AddressListComponent 
  extends ContentMixin<AddressListItemOptions>(LitElement) {
  static styles = styles;

  protected addressService = resolve(AddressService);

  protected selectedAddress$ = new ReplaySubject<Address | null>(1);

  @asyncState()
  protected selectedAddress = valueType(this.selectedAddress$);

  @subscribe()
  protected handleSelectedAddress$ = this.selectedAddress$.pipe(
    tap((address) => {
      if (address) {
        this.dispatchEvent(
          new CustomEvent(SELECT_EVENT, {
            bubbles: true,
            composed: true,
            detail: { address },
          })
        );

        console.log(this.renderRoot.querySelector<HTMLInputElement>(`input[checked]`))
      }
    }),
    distinctUntilChanged()
  );

  protected addresses$ = this.addressService.getAddresses().pipe(distinctUntilChanged());

  @asyncState()
  protected addresses = valueType(this.addresses$);

  @subscribe()
  protected handleAddresses$ = combineLatest([
    this.addresses$,
    this.options$,
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
    if (!this.addresses?.length) {
      return this.renderEmptyMessage();
    }

    return html`${repeat(
      this.addresses,
      (address) => address.id,
      (address) => {
        const selected = !!(
          this.componentOptions.selectable && this.selectedAddress?.id === address.id
        );

        return html`<oryx-tile ?selected=${selected}>
          <oryx-address-list-item
            .addressId=${address.id}
            .options=${this.componentOptions}
          >
            ${when(
              this.componentOptions.selectable,
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
}
