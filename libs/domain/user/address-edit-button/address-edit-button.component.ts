import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { LinkService } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { AddressMixin } from '../src/mixins';
import { CrudState } from '../src/models';
import { AddressEditButtonOptions, Target } from './address-edit-button.model';
import { RouteLinkType } from '@spryker-oryx/router/lit';

@defaultOptions({ target: Target.Link })
@hydrate({ event: ['mouseover', 'focusin'] })
export class UserAddressEditButtonComponent extends AddressMixin(
  ContentMixin<AddressEditButtonOptions>(LitElement)
) {
  protected semanticLinkService = resolve(LinkService);

  protected editLink = computed(() => {
    const id = this.$addressId();
    if (!id) return;
    return this.semanticLinkService.get({
      type: RouteLinkType.AddressBookEdit,
      id,
    });
  });

  protected render(): TemplateResult | void {
    if (this.$options().target === Target.Link) {
      return html`
        <oryx-button outline>
          <a href=${this.editLink()} ?disabled=${!this.$addressId()}>
            <oryx-icon .type=${IconTypes.Edit}></oryx-icon>
            ${this.i18n(['edit', 'user.address.edit-address'])}
          </a>
        </oryx-button>
      `;
    } else {
      return html`
        <oryx-button outline>
          <button @click=${this.onEdit} ?disabled=${!this.$addressId()}>
            <oryx-icon .type=${IconTypes.Edit}></oryx-icon>
            ${this.i18n(['edit', 'user.address.edit'])}
          </button>
        </oryx-button>
      `;
    }
  }

  protected onEdit(): void {
    this.addressStateService.set(CrudState.Update);
  }
}
