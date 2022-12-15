import { ComponentMixin } from '@spryker-oryx/experience';
import { Address } from '@spryker-oryx/user';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, observe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { BehaviorSubject } from 'rxjs';
import { AddressBookState, CHANGE_STATE_EVENT } from './address-book.model';
import { styles } from './address-book.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressBookComponent extends ComponentMixin() {
  static styles = styles;

  @property({ attribute: 'active-state' })
  activeState = AddressBookState.List;

  @observe()
  protected activeState$ = new BehaviorSubject(this.activeState);

  protected onEdit(address: Address): void {
    this.changeState(AddressBookState.Edit);
    // TODO: replace by logic
    console.log('edit', address);
  }

  protected onRemove(address: Address): void {
    this.changeState(AddressBookState.Remove);
    // TODO: replace by logic
    console.log('remove', address);
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

  protected renderListState(): TemplateResult {
    return html`
      <oryx-button>
        <button @click=${(): void => this.changeState(AddressBookState.Add)}>
          <oryx-icon type="add"></oryx-icon>
          ${i18n('user.address.add-address')}
        </button>
      </oryx-button>

      <oryx-address-list
        .options=${{ editable: true }}
        @oryx.edit=${(e: CustomEvent): void => this.onEdit(e.detail.address)}
        @oryx.remove=${(e: CustomEvent): void =>
          this.onRemove(e.detail.address)}
      ></oryx-address-list>
    `;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.activeState$,
      (state) =>
        html`
          ${when(state === AddressBookState.List, () => this.renderListState())}
        `
    )}`;
  }
}
