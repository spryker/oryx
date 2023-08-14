import { ContextController } from '@spryker-oryx/core';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { AccountMenuLinks } from '@spryker-oryx/user';
import {
  I18nMixin,
  hydrate,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { styles } from './account-menu.styles';

@signalAware()
@hydrate({ event: 'window:load' })
export class AccountMenuComponent extends I18nMixin(LitElement) {
  static styles = styles;
  protected links = [
    { id: AccountMenuLinks.OVERVIEW, icon: IconTypes.Description },
    { id: AccountMenuLinks.PROFILE, icon: IconTypes.User },
    { id: AccountMenuLinks.ADDRESSES, icon: IconTypes.Location },
    { id: AccountMenuLinks.ORDERS_HISTORY, icon: IconTypes.OrdersHistory },
  ];

  protected contextController = new ContextController(this);

  protected $tab = signal(this.contextController.get<string>('tab'));

  protected override render(): TemplateResult {
    return html`${repeat(
      this.links,
      (link) =>
        html`<oryx-button
          class="${this.$tab() === link.id ? 'active' : ''}"
          .type="${ButtonType.Text}"
          .text=${this.i18n(`account.${link.id}`)}
          .icon=${link.icon}
          href="/account/${link.id}"
        ></oryx-button>`
    )}`;
  }
}
