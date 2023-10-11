import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, css, html } from 'lit';

export class CartEditComponent extends ContentMixin(LitElement) {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    oryx-input {
      grid-column: 1 / span 2;
    }
  `;

  protected override render(): TemplateResult {
    return html`
      <oryx-input label="name"><input /></oryx-input>

      <oryx-select label="currency">
        <select>
          <option>EUR</option>
          <option selected>USD</option>
        </select>
      </oryx-select>

      <oryx-select label="pricemode">
        <select>
          <option>Gross</option>
          <option selected>Net</option>
        </select>
      </oryx-select>

      <oryx-button>create</oryx-button>
    `;
  }
}
