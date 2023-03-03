import { resolve } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/ui';
import { Address, AddressService } from '@spryker-oryx/user';
import { AddressBookState } from '@spryker-oryx/user/address-book';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { AddressModalConfig } from './manage-address.model';
import { styles } from './manage-address.styles';

@hydratable(['mouseover', 'focusin'])
export class ManageAddressComponent extends LitElement {
  static styles = styles;

  protected config: AddressModalConfig = {
    [AddressBookState.List]: {
      heading: i18n('checkout.address.addresses'),
    },
    [AddressBookState.Add]: {
      heading: i18n('checkout.address.add-address'),
    },
    [AddressBookState.Edit]: {
      heading: i18n('checkout.address.edit-address'),
    },
  };

  protected addressService = resolve(AddressService);

  protected addressBookState$ = new BehaviorSubject(AddressBookState.List);
  @asyncState()
  protected addressBookState = valueType(this.addressBookState$);

  protected open$ = new BehaviorSubject(false);
  @asyncState()
  protected open = valueType(this.open$);

  protected selectedAddressId$ = new Subject<string | null>();
  @asyncState()
  protected selectedAddressId = valueType(this.selectedAddressId$);

  protected onRemove(address: Address): void {
    this.selectedAddressId$.next(address.id!);
  }

  protected onCancelRemove(e: CustomEvent): void {
    e.stopPropagation();
    this.selectedAddressId$.next(null);
  }

  protected onConfirmRemove(address: Address): void {
    this.addressService
      .deleteAddress(address)
      .pipe(tap(() => this.selectedAddressId$.next(null)))
      .subscribe();
  }

  protected goToList(): void {
    this.addressBookState$.next(AddressBookState.List);
    this.selectedAddressId$.next(null);
  }

  protected onStateChange(e: CustomEvent): void {
    this.addressBookState$.next(e.detail.state);
  }

  protected showModal(): void {
    this.open$.next(true);
  }

  protected onModalClose(): void {
    this.goToList();
    this.open$.next(false);
  }

  protected override render(): TemplateResult {
    if (!this.addressBookState) {
      return html``;
    }

    const { heading } = this.config[this.addressBookState];

    return html`
      <oryx-button type="text" size=${Size.Sm}>
        <button @click=${(): void => this.showModal()}>
          ${i18n('checkout.address.change')}
        </button>
      </oryx-button>

      <oryx-modal
        ?open=${this.open}
        preventCloseByEscape
        preventCloseByBackdrop
        enableCloseButtonInHeader
        ?enableNavigateBack=${this.addressBookState !== AddressBookState.List}
        @oryx.close=${this.onModalClose}
        @oryx.back=${this.goToList}
        heading=${heading}
      >
        <oryx-user-address-book
          active-state=${this.addressBookState}
          @oryx.change-state=${(e: CustomEvent): void => this.onStateChange(e)}
          @oryx.remove=${(e: CustomEvent): void =>
            this.onRemove(e.detail.address)}
          @oryx.success=${this.goToList}
          @oryx.cancel=${this.goToList}
        ></oryx-user-address-book>

        <oryx-modal
          ?open=${!!this.selectedAddressId}
          preventCloseByEscape
          preventCloseByBackdrop
          @oryx.close=${(e: CustomEvent): void => this.onCancelRemove(e)}
          heading=${i18n('checkout.address.remove-address')}
        >
          <oryx-user-address-remove
            .addressId=${this.selectedAddressId}
            @oryx.cancel=${(e: CustomEvent): void => this.onCancelRemove(e)}
            @oryx.confirm=${(e: CustomEvent): void =>
              this.onConfirmRemove(e.detail.address)}
          ></oryx-user-address-remove>
        </oryx-modal>
      </oryx-modal>
    `;
  }
}
