import { Size } from '@spryker-oryx/ui/utilities';
import { AddressBookState } from '@spryker-oryx/user/address-book';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AddressModalConfig } from './manage-address.model';

@hydratable(['mouseover', 'focusin'])
export class ManageAddressComponent extends LitElement {
  protected config: AddressModalConfig = {
    [AddressBookState.List]: {
      header: i18n('checkout.address.addresses'),
    },
    [AddressBookState.Add]: {
      header: i18n('checkout.address.add-address'),
    },
    [AddressBookState.Edit]: {
      header: i18n('checkout.address.edit-address'),
    },
    [AddressBookState.Remove]: {
      header: i18n('checkout.address.remove-address'),
    },
  };

  protected state$ = new BehaviorSubject(AddressBookState.List);
  protected open$ = new BehaviorSubject(false);

  protected modalData$ = combineLatest([this.state$, this.open$]).pipe(
    map(([state, open]) => ({
      state,
      open,
      ...this.config[state],
    }))
  );

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
      <oryx-button outline size=${Size.small}>
        <button @click=${(): void => this.showModal()}>
          <oryx-icon type="edit"></oryx-icon>
          ${i18n('checkout.address.manage-address')}
        </button>
      </oryx-button>

      ${asyncValue(
        this.modalData$,
        ({ state, open, header }) => html` <oryx-modal
          ?open=${open}
          preventCloseWithEscape
          preventCloseWithBackdrop
          withoutFooter
          @oryx.close=${(): void => this.onClose()}
          header=${header}
        >
          <oryx-user-address-book
            active-state=${state}
            @oryx.change-state=${(e: CustomEvent): void =>
              this.onStateChange(e)}
          ></oryx-user-address-book>
        </oryx-modal>`
      )}
    `;
  }
}
