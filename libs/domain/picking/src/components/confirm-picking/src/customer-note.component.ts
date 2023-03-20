import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './customer-note.styles';

export class CustomerNoteComponent extends LitElement {
  static styles = styles;

  // protected cartService = resolve(CartService);

  protected onClick(): void {
    //
  }

  protected override render(): TemplateResult {
    return html`
      <section>
        <oryx-navigate-back></oryx-navigate-back>
        <oryx-image resource="user-note"></oryx-image>
        <oryx-heading>
          <h4>${i18n('picking.customer-note')}</h4>
        </oryx-heading>
      </section>
      
      <p>
        Please only ripe bananas, and the largest pumpkins available. Ring the bell at Thompson. Head to the 4th floor. 
      </p>

      <oryx-button>
        <button @click=${this.onClick}>
          ${i18n('picking.proceed-to-picking')}
        </button>
      </oryx-button>
    `;
  }
}
