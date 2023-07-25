import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { AddressMixin, CrudState } from '@spryker-oryx/user';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import {
  AddressDefaults,
  EditTarget,
  UserAddressListItemOptions,
} from './address-list-item.model';
import { styles } from './address-list-item.styles';

@hydrate({ event: 'window:load' })
export class UserAddressListItemComponent extends AddressMixin(
  ContentMixin<UserAddressListItemOptions>(LitElement)
) {
  static styles = styles;

  protected semanticLinkService = resolve(LinkService);

  protected editLink = computed(() => {
    const id = this.$address()?.id;
    return this.semanticLinkService.get({
      type: RouteType.AddressBookEdit,
      id,
    });
  });

  protected override render(): TemplateResult | void {
    if (!this.$address()) return;

    if (this.$options()?.selectable) {
      return html`<oryx-radio>
        <slot></slot>${this.renderContent()}
      </oryx-radio>`;
    } else {
      return html`<section>${this.renderContent()}</section> `;
    }
  }

  protected renderContent(): TemplateResult | void {
    return html`
      <div>
        <oryx-user-address
          .addressId=${this.$address()?.id}
        ></oryx-user-address>
        ${this.renderActions()}
      </div>
      ${this.renderDefaults()}
    `;
  }

  protected renderDefaults(): TemplateResult | void {
    const address = this.$address();
    const { addressDefaults } = this.$options();
    if (!address) return;

    const showAll = addressDefaults === AddressDefaults.All;
    const showBilling = addressDefaults === AddressDefaults.Billing;
    const showShipping = addressDefaults === AddressDefaults.Shipping;

    const defaultBilling = address.isDefaultBilling && (showAll || showBilling);
    const defaultShipping =
      address.isDefaultShipping && (showAll || showShipping);

    if (!defaultBilling && !defaultShipping) return;

    const chip = (token: string) =>
      html`<oryx-chip .appearance=${AlertType.Success}
        >${this.i18n(token)}</oryx-chip
      >`;

    return html`<div slot="subtext">
      ${when(defaultShipping, () =>
        chip(showAll ? 'user.address.default-shipping' : 'user.address.default')
      )}
      ${when(defaultBilling, () =>
        chip(showAll ? 'user.address.default-billing' : 'user.address.default')
      )}
    </div>`;
  }

  protected renderActions(): TemplateResult | void {
    const address = this.$address();
    const { editable, removable } = this.$options();
    if (!address || (!editable && !removable)) return;

    return html`<div class="controls">
      ${this.renderEditTrigger()} ${this.renderRemoveTrigger()}
    </div>`;
  }

  protected renderEditTrigger(): TemplateResult | void {
    const address = this.$address();
    const { editable, editTarget } = this.$options();
    if (!address || !editable) return;

    if (editTarget === EditTarget.Link) {
      return html`
        <oryx-button
          .type=${ButtonType.Icon}
          .size=${ButtonSize.Md}
          .icon=${IconTypes.Edit}
          .href=${this.editLink()}
        ></oryx-button>
      `;
    }

    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${ButtonSize.Md}
        .icon=${IconTypes.Edit}
        .label=${this.i18n('user.address.edit')}
        @click=${this.onEdit}
      ></oryx-button>
    `;
  }

  protected renderRemoveTrigger(): TemplateResult | void {
    if (!this.$options().removable) return;
    return html`
      <oryx-user-address-remove
        .addressId=${this.$address()?.id}
      ></oryx-user-address-remove>
    `;
  }

  protected onEdit(): void {
    const address = this.$address();
    this.addressStateService.set(CrudState.Update, address?.id);
  }
}
