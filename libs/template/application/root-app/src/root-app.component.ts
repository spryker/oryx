import { LitRouter } from '@spryker-oryx/router/lit';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './root-app.styles';

@hydratable()
export class RootAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      <experience-composition uid="header"></experience-composition>
      ${this.router.outlet()}
      <experience-composition uid="footer"></experience-composition>
    `;
  }
}
