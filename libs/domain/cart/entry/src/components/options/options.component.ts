import { ComponentMixin } from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CartEntryCompositionOptions } from '../../entry.model';
import { optionsBaseStyles } from './options.styles';

export class CartEntryOptionsComponent extends ComponentMixin<CartEntryCompositionOptions>() {
  static styles = optionsBaseStyles;

  @property({ type: Boolean, attribute: 'show-options' })
  showOptions?: boolean;

  protected onToggle(state: boolean): void {
    this.dispatchEvent(new CustomEvent('toggle', { detail: { state } }));
  }

  protected render(): TemplateResult {
    const selectedProductOptions = this.options?.selectedProductOptions;

    return html`
      <span>
        Product options (${selectedProductOptions?.length}):
        <oryx-button type="text">
          <button @click=${(): void => this.onToggle(!this.showOptions)}>
            ${this.showOptions ? 'Hide' : 'Show'}
          </button>
        </oryx-button>
      </span>

      <!-- TODO: Replace by product-options -->
      <ul>
        ${selectedProductOptions?.map(
          ({ optionName, price }) => html`<li>
            <span>${optionName}</span>
            <cart-entry-price
              .price="${price}"
              ?loading="${this.options?.updating}"
            ></cart-entry-price>
          </li>`
        )}
      </ul>
    `;
  }
}
