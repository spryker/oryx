import { ContentMixin } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address } from '@spryker-oryx/user';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import {
  elementEffect,
  hydratable,
  i18n,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { AddressBookState, CHANGE_STATE_EVENT } from './address-book.model';
import { styles } from './address-book.styles';

@hydratable(['mouseover', 'focusin'])
export class UserAddressBookComponent extends ContentMixin(LitElement) {
  static styles = styles;

  @signalProperty() activeState = AddressBookState.List;
  @state() selected?: string;

  @elementEffect()
  protected dispatchStateChange = () => {
    if (this.activeState) {
      this.dispatchEvent(
        new CustomEvent(CHANGE_STATE_EVENT, {
          detail: { state: this.activeState },
          composed: true,
          bubbles: true,
        })
      );
    }
  };

  protected override render(): TemplateResult {
    if (this.activeState !== AddressBookState.List) {
      return this.renderForm();
    }

    return this.renderAddressList();
  }

  protected renderAddressList(): TemplateResult {
    return html`
      <oryx-button outline>
        <button @click=${() => (this.activeState = AddressBookState.Add)}>
          <oryx-icon .type=${IconTypes.Add}></oryx-icon>
          ${i18n('user.address.add-address')}
        </button>
      </oryx-button>

      <oryx-user-address-list
        .options=${{
          editable: true,
          removable: true,
          addressDefaults: AddressDefaults.All,
        }}
        @oryx.edit=${(e: CustomEvent): void => this.onEdit(e.detail.address)}
      ></oryx-user-address-list>
    `;
  }

  protected renderForm(): TemplateResult {
    return html`
      <oryx-user-address-edit
        .addressId=${this.selected}
        @oryx.success=${this.onCancel}
        @oryx.back=${this.onCancel}
      ></oryx-user-address-edit>
    `;
  }

  protected onEdit(address: Address): void {
    this.activeState = AddressBookState.Edit;
    this.selected = address.id;
  }

  protected onCancel(): void {
    this.activeState = AddressBookState.List;
  }
}
