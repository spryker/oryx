import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { CartSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@defaultOptions({ maxVisibleQuantity: 99 })
@hydratable('window:load')
export class CartSummaryComponent extends CartComponentMixin(
  ContentMixin<CartSummaryOptions>(LitElement)
) {
  static styles = styles;

  protected linkService = resolve(SemanticLinkService);

  @asyncState()
  protected link = valueType(
    this.linkService.get({ type: SemanticLinkType.Cart })
  );

  @asyncState()
  protected quantity = valueType(this.quantity$);

  protected override render(): TemplateResult {
    return html`
      <oryx-button>
        <a href=${ifDefined(this.link)}>
          <oryx-icon type="cart"></oryx-icon>
          ${this.renderMark()}
          <oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1}>
            ${i18n(['cart', 'cart.summary.heading'])}
          </oryx-heading>
        </a>
      </oryx-button>

      <!-- <oryx-menu-item>
        <oryx-menu-item-button slot="trigger" icon="cart" .url=${this.link}>
          ${when(this.quantity, () => html`<mark>${this.quantity}</mark>`)}
          <span slot="text">${i18n(['cart', 'cart.summary.heading'])}</span>
        </oryx-menu-item-button>
      </oryx-menu-item> -->
    `;
  }

  /**
   * Renders the quantity of the total cart items.
   *
   * When the quantity is larger that the allowed max visible,
   * the quantity is _truncated_ to the `maxVisibleQuantity`, e.g.
   * "99+".
   */
  protected renderMark(): TemplateResult | void {
    const quantity =
      this.totalQuantity &&
      this.componentOptions?.maxVisibleQuantity &&
      this.totalQuantity > this.componentOptions?.maxVisibleQuantity
        ? `${this.componentOptions?.maxVisibleQuantity}+`
        : Number(this.totalQuantity);
    if (Number(this.totalQuantity)) {
      return html`<mark>${quantity}</mark>`;
    }
  }
}
