import { ContentMixin } from '@spryker-oryx/experience';
import { Product, ProductMixin } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { asyncState, hydratable, valueType } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { ProductTitleOptions } from './title.model';
import { styles } from './title.styles';

@hydratable()
export class ProductTitleComponent extends ProductMixin(
  ContentMixin<ProductTitleOptions>(LitElement)
) {
  static styles = styles;

  // TODO: Legacy workaround, remove when product property is not used anymore
  // We should drop both product property definition and productLegacy from this component
  // and use only product provided by ProductMixin
  @property({ type: Object })
  product: Product | null = null;

  // TODO: Legacy workaround, remove when product property is not used anymore
  @asyncState()
  productLegacy = valueType(this.productController.getProductLegacy());

  protected override render(): TemplateResult {
    const options = this.componentOptions;

    return html`<oryx-heading
      .tag=${options?.tag}
      .maxLines=${options?.maxLines}
    >
      ${when(
        !options?.link,
        () => html`${this.productLegacy?.name}`,
        () => this.renderLink()
      )}
    </oryx-heading>`;
  }

  protected renderLink(): TemplateResult {
    return html`
      <content-link
        .options="${{
          type: SemanticLinkType.Product,
          id: this.productLegacy?.sku,
          multiLine: true,
        }}"
        >${this.productLegacy?.name}</content-link
      >
    `;
  }
}
