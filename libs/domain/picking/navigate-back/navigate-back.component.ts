import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { NavigateBackAttributes } from './navigate-back.model';
import { navigateBackComponentStyles } from './navigate-back.styles';

export class NavigateBackComponent
  extends LitElement
  implements NavigateBackAttributes
{
  static styles = navigateBackComponentStyles;

  @property()
  url = '/';

  protected override render(): TemplateResult {
    return html`
      <oryx-button type=${ButtonType.Text}>
        <a href=${this.url}>
          <oryx-icon .type=${IconTypes.ArrowBack}></oryx-icon>
          ${i18n('picking.button.back')}
        </a>
      </oryx-button>
    `;
  }
}
