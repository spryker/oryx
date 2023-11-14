import { LitRouter } from '@spryker-oryx/router/lit';
import { featureVersion, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './oryx-app.styles';

@hydrate()
export class OryxAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    const outletHtml = html`${this.router.outlet()}`;

    if (featureVersion >= '1.2') {
      return outletHtml;
    }

    return html`
      <oryx-composition uid="header"></oryx-composition>
      ${outletHtml}
      <oryx-composition uid="footer"></oryx-composition>
    `;
  }
}
