import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ProductAttributesOptions } from './attributes.model';
import { ProductAttributeStyles } from './attributes.styles';

@defaultOptions({ columnCount: 2 })
@hydratable()
export class ProductAttributesComponent extends ProductMixin(
  ContentMixin<ProductAttributesOptions>(LitElement)
) {
  static styles = [ProductAttributeStyles];

  protected override render(): TemplateResult {
    if (this.componentOptions?.columnCount) {
      this.setAttribute(
        'style',
        `--column-count: ${this.componentOptions?.columnCount}`
      );
    }

    return html`<ul>
      ${Object.keys(this.product?.attributes ?? {}).map(
        (key) => html`<li>
          <div>${this.product?.attributeNames?.[key]}</div>
          <div>${this.product?.attributes?.[key]}</div>
        </li>`
      )}
    </ul>`;
  }
}
