import { resolve } from '@spryker-oryx/di';
import { Address, AddressService } from '@spryker-oryx/user';
import { AddressBookState } from '@spryker-oryx/user/address-book';
import { hydratable, i18n, signalAware, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { tap } from 'rxjs';
import { styles } from './manage-address.styles';

@signalAware()
@hydratable(['mouseover', 'focusin'])
export class ManageAddressComponent extends LitElement {
  static styles = styles;

  protected addressService = resolve(AddressService);

  @state()
  protected state = AddressBookState.List;

  @state()
  protected open?: boolean;

  @state()
  protected selected?: string;

  protected headings = {
    [AddressBookState.List]: i18n('checkout.address.addresses'),
    [AddressBookState.Add]: i18n('checkout.address.add-address'),
    [AddressBookState.Edit]: i18n('checkout.address.edit-address'),
  };

  protected override render(): TemplateResult | void {
    const heading = this.headings[this.state];

    return html`
      <oryx-button type="text" size=${Size.Sm}>
        <button @click=${this.goToList}>
          ${i18n('checkout.address.change')}
        </button>
      </oryx-button>

      <oryx-modal
        ?open=${this.open}
        .heading=${heading}
        preventCloseByEscape
        preventCloseByBackdrop
        enableCloseButtonInHeader
        ?enableNavigateBack=${this.state !== AddressBookState.List}
        @oryx.close=${this.onClose}
        @oryx.back=${this.goToList}
      >
        <oryx-user-address-book
          .activeState=${this.state}
          @oryx.change-state=${this.onStateChange}
          @oryx.remove=${this.onRemove}
          @oryx.success=${this.goToList}
          @oryx.cancel=${this.goToList}
        ></oryx-user-address-book>
      </oryx-modal>

      ${this.renderRemoveConfirmationModal()}
    `;
  }

  protected goToList(): void {
    this.open = true;
    this.state = AddressBookState.List;
  }

  protected onClose(): void {
    this.open = false;
  }

  protected onRemove(ev: CustomEvent): void {
    this.selected = ev.detail.address.id;
  }

  protected onStateChange(e: CustomEvent): void {
    this.state = e.detail.state;
  }

  protected renderRemoveConfirmationModal(): TemplateResult | void {
    if (!this.selected) return;
    return html` <oryx-modal
      open
      .heading=${i18n('checkout.address.remove-address')}
      preventCloseByEscape
      preventCloseByBackdrop
      @oryx.close=${(e: CustomEvent): void => this.onCancelRemove(e)}
    >
      <oryx-user-address-remove
        .addressId=${this.selected}
        @oryx.cancel=${(e: CustomEvent): void => this.onCancelRemove(e)}
        @oryx.confirm=${(e: CustomEvent): void =>
          this.onConfirmRemove(e.detail.address)}
      ></oryx-user-address-remove>
    </oryx-modal>`;
  }

  protected onCancelRemove(e: CustomEvent): void {
    e.stopPropagation();
    this.selected = undefined;
  }

  protected onConfirmRemove(address: Address): void {
    this.addressService
      .deleteAddress(address)
      .pipe(tap(() => (this.selected = undefined)))
      .subscribe();
  }
}
