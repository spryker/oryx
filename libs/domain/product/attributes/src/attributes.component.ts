import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { hydratable, i18n, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAttributesOptions } from './attributes.model';
import { ProductAttributeStyles } from './attributes.styles';

@ssrShim('style')
@defaultOptions({ columnCount: '2' })
@hydratable()
export class ProductAttributesComponent extends ProductMixin(
  ContentMixin<ProductAttributesOptions>(LitElement)
) {
  static styles = [ProductAttributeStyles];

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
      ? html`${i18n(name)}`
      : html`${names[key]}`;
  }
}
