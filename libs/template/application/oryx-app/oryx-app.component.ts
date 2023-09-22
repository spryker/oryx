import { LitRouter } from '@spryker-oryx/router/lit';
import { featureVersion, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './oryx-app.styles';

@hydrate()
export class OryxAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      ${featureVersion < '1.1'
        ? html`<oryx-composition uid="header"></oryx-composition>`
        : ''}
      ${this.router.outlet()}
      ${featureVersion < '1.1'
        ? html`<oryx-composition uid="footer"></oryx-composition>`
        : ''}
    `;
  }
}
