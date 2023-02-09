import { resolve } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/ui';
import { Address, AddressService } from '@spryker-oryx/user';
import { AddressBookState } from '@spryker-oryx/user/address-book';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, map, Subject, tap } from 'rxjs';
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

  protected state$ = new BehaviorSubject(AddressBookState.List);
  protected open$ = new BehaviorSubject(false);
  protected selectedAddressId$ = new Subject<string | null>();

  protected modalData$ = combineLatest([this.state$, this.open$]).pipe(
    map(([state, open]) => ({
      state,
      open,
      ...this.config[state],
    }))
  );

  protected onRemove(address: Address): void {
    this.selectedAddressId$.next(address.id ?? null);
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

  protected onClose(): void {
    this.state$.next(AddressBookState.List);
    this.open$.next(false);
  }

  protected onStateChange(e: CustomEvent): void {
    this.state$.next(e.detail.state);
  }

  protected showModal(): void {
    this.open$.next(true);
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-button type="text" size=${Size.small}>
        <button @click=${(): void => this.showModal()}>
          ${i18n('checkout.address.change')}
        </button>
      </oryx-button>

      ${asyncValue(
        this.modalData$,
        ({ state, open, heading }) => html` <oryx-modal
          ?open=${open}
          preventCloseByEscape
          preventCloseByBackdrop
          enableCloseButtonInHeader
          @oryx.close=${(): void => this.onClose()}
          heading=${heading}
        >
          <oryx-user-address-book
            active-state=${state}
            @oryx.change-state=${(e: CustomEvent): void =>
              this.onStateChange(e)}
            @oryx.remove=${(e: CustomEvent): void =>
              this.onRemove(e.detail.address)}
          ></oryx-user-address-book>

          ${asyncValue(
            this.selectedAddressId$,
            (addressId) => html`
              <oryx-modal
                ?open=${!!addressId}
                preventCloseByEscape
                preventCloseByBackdrop
                @oryx.close=${(e: CustomEvent): void => this.onCancelRemove(e)}
                heading=${i18n('checkout.address.remove-address')}
              >
                <oryx-user-address-remove
                  .addressId=${addressId}
                  @oryx.cancel=${(e: CustomEvent): void =>
                    this.onCancelRemove(e)}
                  @oryx.confirm=${(e: CustomEvent): void =>
                    this.onConfirmRemove(e.detail.address)}
                ></oryx-user-address-remove>
              </oryx-modal>
            `
          )}
        </oryx-modal>`
      )}
    `;
  }
}
