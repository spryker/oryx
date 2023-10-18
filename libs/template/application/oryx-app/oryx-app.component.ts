import { LitRouter } from '@spryker-oryx/router/lit';
import { featureVersion, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { OryxAppAttributes, OryxAppType } from './oryx-app.model';
import { styles } from './oryx-app.styles';

@hydrate()
export class OryxAppComponent extends LitElement implements OryxAppAttributes {
  static styles = styles;

  @property({ reflect: true }) type = OryxAppType.None;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      ${featureVersion < '1.2'
        ? html`<oryx-composition uid="header"></oryx-composition>`
        : ''}
      ${this.router.outlet()}
      ${featureVersion < '1.2'
        ? html`<oryx-composition uid="footer"></oryx-composition>`
        : ''}
    `;
  }
}
