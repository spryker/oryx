import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  Address,
  AddressEventDetail,
  AddressMixin,
  CrudState,
} from '@spryker-oryx/user';
import {
  AddressDefaults,
  EditTarget,
} from '@spryker-oryx/user/address-list-item';
import { effect, hydratable, i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { queryAll } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { UserAddressListOptions } from './address-list.model';
import { styles } from './address-list.styles';

@defaultOptions({
  addressDefaults: AddressDefaults.All,
  editTarget: EditTarget.Link,
})
@hydratable('window:load')
export class UserAddressListComponent extends AddressMixin(
  ContentMixin<UserAddressListOptions>(LitElement)
) {
  static styles = styles;

  @queryAll('input') protected inputElements?: HTMLInputElement[];

  connectedCallback(): void {
    super.connectedCallback();
    this.addressStateService.clear();
  }

  protected selectRadioElements = effect(() => {
    const addressId = this.$addressId();
    this.inputElements?.forEach((el) => {
      el.checked = el.value === addressId;
    });
  });

  protected override render(): TemplateResult | TemplateResult[] | void {
    const addresses = this.$addresses();
    if (!addresses?.length) return this.renderEmpty();
    return addresses.map((address) => this.renderAddress(address));
  }

  protected renderEmpty(): TemplateResult | void {
    return html`<slot name="empty">
      <oryx-icon .type=${IconTypes.Location} size=${Size.Lg}></oryx-icon>
      ${i18n('user.address.no-addresses')}
    </slot>`;
  }

  protected renderAddress(address: Address): TemplateResult {
    const selected = this.isSelected(address.id);

    return html`<oryx-tile ?selected=${selected}>
        <oryx-user-address-list-item
          .addressId=${address.id}
          .options=${this.$options()}
        >
          ${when(
            this.$options()?.selectable,
            () => html`<input
              name="address"
              type="radio"
              value="${address.id as string}"
              ?checked=${selected}
              @input=${this.onInput}
            />`
          )}
        </oryx-user-address-list-item>
      </oryx-tile>
      ${this.renderModal()}`;
  }

  protected isSelected(addressId?: string): boolean {
    return !!this.$options()?.selectable && this.$addressId() === addressId;
  }

  protected onInput(ev: Event): void {
    ev.stopPropagation();
    const el = ev.target as HTMLInputElement;
    this.select(el.value);
  }

  protected select(id: string): void {
    this.addressStateService.set(CrudState.Read, id);
    const address = this.$addresses()?.find((address) => address.id === id);
    if (address) {
      this.dispatchEvent(
        new CustomEvent<AddressEventDetail>('change', {
          bubbles: true,
          composed: true,
          detail: { address },
        })
      );
    }
  }

  protected createKey(addressId?: string): string {
    return `${addressId}-${this.$addresses()?.findIndex(
      (a) => a.id === addressId
    )}-${this.$addresses?.length}`;
  }

  protected renderModal(): TemplateResult | void {
    if (
      this.$options().editTarget === EditTarget.Modal &&
      this.$addressState().action === CrudState.Update
    ) {
      return html`<oryx-modal
        open
        .heading=${i18n('checkout.address.edit-address')}
        @oryx.close=${this.onClose}
      >
        <oryx-user-address-edit></oryx-user-address-edit>
      </oryx-modal>`;
    }
  }

  protected onClose(e: Event): void {
    e.stopPropagation();
    this.addressStateService.clear();
  }
}
