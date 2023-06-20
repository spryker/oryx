import { LitRouter } from '@spryker-oryx/router/lit';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './oryx-app.styles';

@hydratable()
export class OryxAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      <oryx-composition uid="header"></oryx-composition>
      ${this.router.outlet()}
      <oryx-composition uid="footer"></oryx-composition>
    `;
  }
}
