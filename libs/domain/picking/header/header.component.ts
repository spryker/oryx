import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './header.styles';
import { query } from 'lit/decorators.js';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import { SiteNavigationItemComponent } from '@spryker-oryx/site/navigation-item';

export class HeaderComponent extends LitElement {
  static styles = styles;

  @query('oryx-site-navigation-item')
  protected siteNavigationItem?: SiteNavigationItemComponent;

  protected onClose(): void {
    this.siteNavigationItem?.shadowRoot
      ?.querySelector<ModalComponent>('oryx-modal')
      ?.toggleAttribute('open', false);
  }

  protected override render(): TemplateResult {
    return html`
      <slot></slot>
      <oryx-site-navigation-item
        uid="user-profile"
        @oryx.close=${this.onClose}
        .options=${{
          icon: IconTypes.User,
          triggerType: 'icon',
          contentBehavior: 'modal',
          label: i18n('oryx.picking.account'),
        }}
      ></oryx-site-navigation-item>
    `;
  }
}

export default HeaderComponent;
