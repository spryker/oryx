import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { AddressMixin } from '../src/mixins';
import { CrudState } from '../src/models';
import { AddressEditButtonOptions, Target } from './address-edit-button.model';

@defaultOptions({ target: Target.Link })
@hydrate({ event: ['mouseover', 'focusin'] })
export class UserAddressEditButtonComponent extends AddressMixin(
  ContentMixin<AddressEditButtonOptions>(LitElement)
) {
  protected semanticLinkService = resolve(LinkService);

  protected editLink = computed(() => {
    const id = this.$addressId();
    if (!id) {
      return;
    }
    return this.semanticLinkService.get({
      type: RouteType.AddressBookEdit,
      id,
    });
  });

  protected render(): TemplateResult | void {
    const href =
      this.$options().target === Target.Link ? this.editLink() : undefined;
    return html`
      <oryx-button
        .type=${ButtonType.Outline}
        .icon=${IconTypes.Edit}
        .text=${this.i18n(['edit', 'user.address.edit-address'])}
        .href=${href}
        ?disabled=${!this.$addressId()}
        @click=${this.onEdit}
      ></oryx-button>
    `;
  }

  protected onEdit(): void {
    this.addressStateService.set(CrudState.Update);
  }
}
