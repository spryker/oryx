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

  @asyncState()
  protected link = valueType(
    resolve(SemanticLinkService).get({
      type: SemanticLinkType.Cart,
    })
  );

  protected override render(): TemplateResult {
    return html`
      <oryx-button>
        <a href=${ifDefined(this.link)}>
          <oryx-icon type="cart"></oryx-icon>

          ${this.renderMark()}

          <oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1}>
            ${i18n('cart.cart')}
          </oryx-heading>
        </a>
      </oryx-button>
    `;
  }

  protected renderMark(): TemplateResult | void {
    if (this.totalQuantity) {
      return html`<mark>${this.populateQuantity()}</mark>`;
    }
  }

  protected populateQuantity(): string | number {
    return this.totalQuantity &&
      this.componentOptions?.maxVisibleQuantity &&
      this.totalQuantity > this.componentOptions?.maxVisibleQuantity
      ? `${this.componentOptions?.maxVisibleQuantity}+`
      : Number(this.totalQuantity);
  }
}
