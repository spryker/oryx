import { LitRouter } from '@spryker-oryx/router/lit';
import { hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './oryx-app.styles';

@hydrate()
export class OryxAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html` ${this.router.outlet()} `;
  }
}
