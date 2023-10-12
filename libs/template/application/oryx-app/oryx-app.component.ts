import { LitRouter } from '@spryker-oryx/router/lit';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './oryx-app.styles';

@hydrate()
export class OryxAppComponent extends LitElement {
  static styles = styles;
  @property() test = 'grid';
  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      <button
        @click=${() => {
          this.test = this.test === 'flex' ? 'grid' : 'flex';
        }}
      >
        test
      </button>

      <oryx-composition
        layout="carousel"
        layout-vertical="true"
        layout-bleed="true"
      ></oryx-composition>

      <oryx-composition layout="grid"></oryx-composition>

      <!-- <oryx-composition uid="footer"></oryx-composition> -->
    `;
  }
}
