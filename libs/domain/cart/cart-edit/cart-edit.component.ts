import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, css, html } from 'lit';

export class CartEditComponent extends ContentMixin(LitElement) {
  static styles = css`
    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    oryx-input {
      grid-column: 1 / span 2;
    }

    oryx-button {
      grid-column: 1;
    }
  `;

  protected override render(): TemplateResult {
    return html`
      <oryx-heading tag="h1" as="h3"> Create cart </oryx-heading>
      <p>You can create multiple carts to organize your running orders.</p>
      <form>
        <oryx-input label="Name"
          ><input placeholder="The name of the shopping cart"
        /></oryx-input>

        <oryx-select label="currency">
          <select>
            <option>EUR</option>
            <option selected>USD</option>
          </select>
        </oryx-select>

        <oryx-select label="price mode">
          <select>
            <option>Gross</option>
            <option selected>Net</option>
          </select>
        </oryx-select>

        <oryx-checkbox>
          <input type="checkbox" checked /> Make this cart my current cart
        </oryx-checkbox>
        <oryx-button>create</oryx-button>
      </form>
    `;
  }
}
