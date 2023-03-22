import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { NavigateBackAttributes } from './navigate-back.model';
import { styles } from './navigate-back.styles';

export class NavigateBackComponent
  extends LitElement
  implements NavigateBackAttributes
{
  static styles = styles;

  @property()
  fallbackUrl = '/';

  protected routerService = resolve(RouterService);

  @asyncState()
  protected link = valueType(this.routerService.previousRoute());

  protected override render(): TemplateResult {
    const link = this.link || this.fallbackUrl;

    return html`
      <oryx-button type="text">
        <a href=${link}>
          <oryx-icon type="backArrow"></oryx-icon>
          ${i18n('picking.button.back')}
        </a>
      </oryx-button>
    `;
  }
}
