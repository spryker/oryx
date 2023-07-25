import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { hydrate, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAttributesOptions } from './attributes.model';
import { productAttributeStyles } from './attributes.styles';

@ssrShim('style')
@defaultOptions({ columnCount: '2' })
@hydrate({ context: ProductContext.SKU })
export class ProductAttributesComponent extends ProductMixin(
  ContentMixin<ProductAttributesOptions>(LitElement)
) {
  static styles = [productAttributeStyles];

  protected override render(): TemplateResult | void {
    const { attributeNames: names, attributes: values } = this.$product() ?? {};

    if (!names || !values) return;

    return html`
      <dl style="--column-count: ${this.$options().columnCount}">
        ${Object.keys(names).map(
          (key) => html`
            <dt>${this.getName(names, key)}</dt>
            <dd>${values[key]}</dd>
          `
        )}
      </dl>
    `;
  }

  protected getName(
    names: Record<string, string>,
    key: string
  ): TemplateResult {
    const name = names[key];
    return name.startsWith('product.attribute.')
      ? html`${this.i18n(name)}`
      : html`${names[key]}`;
  }
}
