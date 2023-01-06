import { ComponentMixin } from '@spryker-oryx/experience';
import { Address } from '@spryker-oryx/user';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import { asyncValue, hydratable, i18n, observe } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { AddressBookState, CHANGE_STATE_EVENT } from './address-book.model';
import { styles } from './address-book.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressBookComponent extends ComponentMixin() {
  static styles = styles;

  @property({ attribute: 'active-state' })
  activeState = AddressBookState.List;

  @observe()
  protected activeState$ = new BehaviorSubject(this.activeState);

  protected selectedAddressId$ = new BehaviorSubject<string | null>(null);

  protected data$ = combineLatest([this.activeState$, this.selectedAddressId$]);

  protected onEdit(address: Address): void {
    this.changeState(AddressBookState.Edit);
    // TODO: replace by logic
    console.log('edit', address);
  }

  protected onCancel(): void {
    this.changeState(AddressBookState.List);
    this.selectedAddressId$.next(null);
  }

  protected changeState(state: AddressBookState): void {
    this.activeState = state;
    this.dispatchEvent(
      new CustomEvent(CHANGE_STATE_EVENT, {
        detail: { state },
        composed: true,
        bubbles: true,
      })
    );
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.data$,
      ([state, addressId]) =>
        html`
          ${when(state === AddressBookState.List, () =>
            this.renderAddressList()
          )}
        `
    )}`;
  }

  protected renderAddressList(): TemplateResult {
    return html`
      <oryx-button outline>
        <button @click=${(): void => this.changeState(AddressBookState.Add)}>
          <oryx-icon type="add"></oryx-icon>
          ${i18n('user.address.add-address')}
        </button>
      </oryx-button>

      <oryx-address-list
        .options=${{
          editable: true,
          removable: true,
          addressDefaults: AddressDefaults.All,
        }}
        @oryx.edit=${(e: CustomEvent): void => this.onEdit(e.detail.address)}
      ></oryx-address-list>
    `;
  }
}
