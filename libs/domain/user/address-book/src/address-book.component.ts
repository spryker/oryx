import { ContentMixin } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address } from '@spryker-oryx/user';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import {
  asyncState,
  hydratable,
  i18n,
  observe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, tap } from 'rxjs';
import { AddressBookState, CHANGE_STATE_EVENT } from './address-book.model';
import { styles } from './address-book.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressBookComponent extends ContentMixin(LitElement) {
  static styles = styles;

  @property()
  activeState = AddressBookState.List;

  @observe('activeState')
  protected activeStateTrigger$ = new BehaviorSubject(this.activeState);

  protected activeState$ = this.activeStateTrigger$.pipe(
    tap((state) => {
      if (state === AddressBookState.List) {
        this.selectedAddressId$.next(null);
      }
    })
  );

  @asyncState()
  protected state = valueType(this.activeState$);

  protected selectedAddressId$ = new BehaviorSubject<string | null>(null);

  @asyncState()
  protected selectedAddressId = valueType(this.selectedAddressId$);

  protected onEdit(address: Address): void {
    this.changeState(AddressBookState.Edit);
    this.selectedAddressId$.next(address.id as string);
  }

  protected onCancel(): void {
    this.changeState(AddressBookState.List);
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
    if (this.state !== AddressBookState.List) {
      return this.renderForm();
    }

    return this.renderAddressList();
  }

  protected renderAddressList(): TemplateResult {
    return html`
      <oryx-button outline>
        <button @click=${(): void => this.changeState(AddressBookState.Add)}>
          <oryx-icon type=${IconTypes.Add}></oryx-icon>
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

  protected renderForm(): TemplateResult {
    return html`
      <oryx-user-address-edit
        .addressId=${this.selectedAddressId}
        @oryx.success=${this.onCancel}
        @oryx.back=${this.onCancel}
      ></oryx-user-address-edit>
    `;
  }
}
