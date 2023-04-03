import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { computed, hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CartSummaryOptions } from './summary.model';
import { styles } from './summary.styles';

@defaultOptions({ maxVisibleQuantity: 99 })
@hydratable('window:load')
export class CartSummaryComponent extends CartComponentMixin(
  ContentMixin<CartSummaryOptions>(LitElement)
) {
  static styles = styles;

  protected linkService = resolve(SemanticLinkService);

  protected link = signal(
    this.linkService.get({ type: SemanticLinkType.Cart })
  );

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
    `;
  }

  protected quantity = computed(() =>
    this.$totalQuantity() &&
    this.$options().maxVisibleQuantity &&
    this.$totalQuantity() > this.$options().maxVisibleQuantity!
      ? `${this.$options().maxVisibleQuantity}+`
      : this.$totalQuantity()
  );

  /**
   * Renders the quantity of the total cart items.
   *
   * When the quantity is larger that the allowed max visible,
   * the quantity is _truncated_ to the `maxVisibleQuantity`, e.g.
   * "99+".
   */
  protected renderMark(): TemplateResult | void {
    if (Number(this.$totalQuantity())) {
      return html`<mark>${this.quantity()}</mark>`;
    }
  }
}
