import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { Address, AddressService, formatAddress } from '@spryker-oryx/user';
import { hydratable, isDefined } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, subscribe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  ReplaySubject,
  take,
  tap,
} from 'rxjs';
import {
  AddressListOptions,
  AddressType,
  ADDRESS_CHANGE_EVENT,
} from './address-list.model';
import { styles } from './address-list.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressListComponent extends ComponentMixin<AddressListOptions>() {
  static styles = styles;

  protected selectedAddress$ = new ReplaySubject<Address | null>(1);

  @subscribe()
  protected handle$ = this.selectedAddress$.pipe(
    tap((address) => {
      if (address) {
        this.dispatchEvent(
          new CustomEvent(ADDRESS_CHANGE_EVENT, {
            bubbles: true,
            composed: true,
            detail: {
              address,
            },
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
        this.isDefault(address, options?.defaultType)
      );

      this.selectedAddress$.next(defaultAddress ?? addresses?.[0] ?? null);
    })
  );

  protected data$ = combineLatest([
    this.addresses$,
    this.selectedAddress$,
  ]).pipe(
    map(
      ([addresses, selectedAddress]): [
        Address[] | null,
        Partial<AddressListOptions>,
        Address | null
      ] => [...addresses, selectedAddress]
    )
  );

  protected isDefault(
    address: Address,
    type: AddressType = AddressType.Shipping
  ): boolean {
    return type === AddressType.Shipping
      ? address?.isDefaultShipping ?? false
      : address?.isDefaultBilling ?? false;
  }

  protected onChange(e: Event): void {
    const radio = e.target as HTMLInputElement;

    this.addresses$
      .pipe(
        take(1),
        tap(([addresses]) => {
          this.selectedAddress$.next(
            addresses?.find((address) => address.id === radio.value) ?? null
          );
        })
      )
      .subscribe();
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.data$,
      ([addresses, options, selectedAddress]) => {
        const { selectable, editable, defaultType } = options;

        if (!addresses || !addresses.length) {
          return html` <slot name="empty">
            <oryx-icon type="carrier" size="large"></oryx-icon>
            ${i18n('user.address.no-addresses')}
          </slot>`;
        }

        return html`${repeat(
          addresses,
          (address) => address.id,
          (address) => {
            const isSelected = selectable
              ? selectedAddress?.id === address.id
              : false;

            return html`<oryx-tile .selected=${isSelected}>
              <div>
                <div class="details">
                  <oryx-radio>
                    ${when(
                      selectable,
                      () => html`<input
                        name="address"
                        type="radio"
                        value="${isDefined(address.id) ? address.id : ''}"
                        .checked=${isSelected}
                        @change=${this.onChange}
                      />`
                    )}
                    ${formatAddress(address)}
                  </oryx-radio>
                  ${when(
                    this.isDefault(address, defaultType),
                    () =>
                      html`<oryx-chip
                        >${i18n('user.address.default')}</oryx-chip
                      >`
                  )}
                </div>
                ${when(
                  editable ?? true,
                  () =>
                    html`<div
                      class="controls ${selectable ? 'selectable' : ''}"
                    >
                      <oryx-button type="text">
                        <button>${i18n('user.address.edit')}</button>
                      </oryx-button>
                    </div>`
                )}
              </div>
            </oryx-tile>`;
          }
        )}`;
      }
    )}`;
  }
}
