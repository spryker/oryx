import { LitRouter } from '@spryker-oryx/router/lit';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './oryx-app.styles';

@hydrate()
export class OryxAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult | void {
    return html`
      <oryx-composition uid="header"></oryx-composition>
      ${this.router.outlet()}
      <oryx-composition uid="footer"></oryx-composition>
    `;
  }
}
