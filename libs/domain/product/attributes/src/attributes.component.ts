import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { hydratable, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAttributesOptions } from './attributes.model';
import { ProductAttributeStyles } from './attributes.styles';

@defaultOptions({ columnCount: '2' })
@ssrShim('style')
@hydratable(['mouseover', 'focusin'])
export class ProductAttributesComponent extends ProductMixin(
  ContentMixin<ProductAttributesOptions>(LitElement)
) {
  static styles = [ProductAttributeStyles];

  protected override render(): TemplateResult | void {
    const attributes = this.$product()?.attributes;
    const attributeNames = this.$product()?.attributeNames;

    if (!attributes || !attributeNames) return;

    return html`
      <dl style="--column-count: ${this.$options().columnCount}">
        ${Object.keys(attributes).map(
          (key) => html`
            <dt>${attributeNames?.[key]}</dt>
            <dd>${attributes?.[key]}</dd>
          `
        )}
      </dl>
    `;
  }
}
