import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './header.styles';

export class HeaderComponent extends LitElement {
  static styles = styles;

  protected override render(): TemplateResult {
    return html`
      <slot></slot>
      <oryx-site-navigation-item
        uid="user-profile"
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
