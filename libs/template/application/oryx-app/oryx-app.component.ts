import { LitRouter } from '@spryker-oryx/router/lit';
import { hydrate, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './oryx-app.styles';

@hydrate()
@signalAware()
export class OryxAppComponent extends LitElement {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected $await = signal(this.router.delayRender());

  protected override render(): TemplateResult | void {
    if (this.$await()) return;

    return html`
      <oryx-composition uid="header"></oryx-composition>
      ${this.router.outlet()}
      <oryx-composition uid="footer"></oryx-composition>
    `;
  }
}
