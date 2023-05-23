import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
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
  fallbackUrl = '/';

  protected routerService = resolve(RouterService);

  @asyncState()
  protected link = valueType(this.routerService.previousRoute());

  protected override render(): TemplateResult {
    const link = this.link || this.fallbackUrl;

    return html`
      <oryx-button type=${ButtonType.Text}>
        <a href=${link}>
          <oryx-icon type="${IconTypes.Back}"></oryx-icon>
          ${i18n('picking.button.back')}
        </a>
      </oryx-button>
    `;
  }
}
