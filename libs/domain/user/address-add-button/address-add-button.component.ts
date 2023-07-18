import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { AddressMixin } from '../src/mixins';
import { CrudState } from '../src/models';
import {
  Target,
  UserAddressAddButtonOptions,
} from './address-add-button.model';
import { ButtonType } from '@spryker-oryx/ui/button';

@defaultOptions({ target: Target.Link })
@hydrate({ event: ['mouseover', 'focusin'] })
export class UserAddressAddButtonComponent extends AddressMixin(
  ContentMixin<UserAddressAddButtonOptions>(LitElement)
) {
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $createLink = signal(
    this.semanticLinkService.get({ type: SemanticLinkType.AddressBookCreate })
  );

  protected render(): TemplateResult | void {
    const href =
      this.$options().target === Target.Link ? this.$createLink() : undefined;

    return html`
      <oryx-button
        .type=${ButtonType.Outline}
        .icon=${IconTypes.Add}
        .text=${this.i18n(['add', 'user.address.add'])}
        .href=${href}
        block
        @click=${this.onCreate}
      ></oryx-button>
    `;
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
