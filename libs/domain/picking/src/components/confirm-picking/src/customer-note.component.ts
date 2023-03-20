import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { PickingListMixin } from '@spryker-oryx/picking';
import { styles } from './customer-note.styles';

export class CustomerNoteComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected onProceed(): void {
    //
  }

  protected override render(): TemplateResult {
    return html`
      <section>
        <oryx-navigate-back></oryx-navigate-back>
        <oryx-image resource="user-note"></oryx-image>
        <oryx-heading as-md="h2">
          <h4>${i18n('picking.customer-note')}</h4>
        </oryx-heading>
      </section>
      
      <p>
        Please only ripe bananas, and the largest pumpkins available. Ring the bell at Thompson. Head to the 4th floor. 
      </p>

      <oryx-button>
        <button @click=${this.onProceed}>
          ${i18n('picking.proceed-to-picking')}
        </button>
      </oryx-button>
    `;
  }
}
