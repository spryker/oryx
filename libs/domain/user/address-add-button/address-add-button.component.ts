import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { AddressMixin } from '../src/mixins';
import { CrudState } from '../src/models';
import {
  Target,
  UserAddressAddButtonOptions,
} from './address-add-button.model';

@defaultOptions({ target: Target.Link })
@hydratable(['mouseover', 'focusin'])
export class UserAddressAddButtonComponent extends AddressMixin(
  ContentMixin<UserAddressAddButtonOptions>(LitElement)
) {
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $createLink = signal(
    this.semanticLinkService.get({ type: SemanticLinkType.AddressBookCreate })
  );

  protected render(): TemplateResult | void {
    if (this.$options().target === Target.Link) {
      return html`
        <oryx-button outline>
          <a href=${this.$createLink()} @click=${this.onCreate}>
            <oryx-icon .type=${IconTypes.Add}></oryx-icon>
            ${this.i18n(['add', 'user.address.add'])}
          </a>
        </oryx-button>
      `;
    } else {
      return html`
        <oryx-button outline>
          <button @click=${this.onCreate}>
            <oryx-icon .type=${IconTypes.Add}></oryx-icon>
            ${this.i18n('user.address.add')}
          </button>
        </oryx-button>
        ${this.renderModal()}
      `;
    }
  }

  protected onCreate(): void {
    this.addressStateService.set(CrudState.Create, null);
  }

  protected renderModal(): TemplateResult | void {
    if (
      this.$options().target === Target.Modal &&
      this.$addressState().action === CrudState.Create
    ) {
      return html`<oryx-modal
        open
        .heading=${this.i18n('checkout.address.create-address')}
        @oryx.close=${this.onClose}
      >
        <oryx-user-address-edit></oryx-user-address-edit>
      </oryx-modal>`;
    }
  }

  protected onClose(): void {
    this.addressStateService.clear();
  }
}
