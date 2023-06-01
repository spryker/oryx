import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './user-navigation-item.styles';

export class UserNavigationItemComponent extends LitElement {
  static styles = styles;

  protected override render(): TemplateResult {
    return html`<oryx-site-navigation-item
      uid="user-profile"
      .options=${{
        icon: IconTypes.Profile,
        triggerType: 'icon',
        contentBehavior: 'modal',
        fullscreen: true,
        heading: i18n('oryx.picking.account'),
      }}
    ></oryx-site-navigation-item>`;
  }
}
