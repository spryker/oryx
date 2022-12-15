import { ComponentMixin } from '@spryker-oryx/experience';
import { AddressBookState } from '@spryker-oryx/user/address-book';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AddressModal, AddressModalConfig } from './address-modal.model';

@hydratable(['mouseover', 'focusin'])
export class AddressModalComponent
  extends ComponentMixin()
  implements AddressModal
{
  protected config: AddressModalConfig = {
    [AddressBookState.List]: {
      header: i18n('user.address.addresses'),
    },
    [AddressBookState.Add]: {
      header: i18n('user.address.add-address'),
    },
    [AddressBookState.Edit]: {
      header: i18n('user.address.edit-address'),
    },
    [AddressBookState.Remove]: {
      header: i18n('user.address.remove-address'),
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

  open(): void {
    this.open$.next(true);
  }

  protected onClose(): void {
    this.state$.next(AddressBookState.List);
    this.open$.next(false);
  }

  protected onStateChange(e: CustomEvent): void {
    this.state$.next(e.detail.state);
  }

  protected override render(): TemplateResult {
    return html` ${asyncValue(this.modalData$, ({ state, open, header }) => {
      return html`
        <oryx-modal
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
        </oryx-modal>
      `;
    })}`;
  }
}
