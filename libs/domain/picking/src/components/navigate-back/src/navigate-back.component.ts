import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './navigate-back.styles';

export class NavigateBackComponent extends LitElement {
  static styles = styles;
  
  protected routerService = resolve(RouterService);

  protected onClick(): void {
    this.routerService.back();
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-button type="text">
        <button @click=${this.onClick}>
          <oryx-icon type="backArrow"></oryx-icon>
          ${i18n('picking.button.back')}
        </button>
      </oryx-button>
    `;
  }
}
