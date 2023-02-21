import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { hydratable, ssrShim, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { tap } from 'rxjs';
import { ProductAttributesOptions } from './attributes.model';
import { ProductAttributeStyles } from './attributes.styles';

@defaultOptions({ columnCount: '2' })
@ssrShim('style')
@hydratable(['mouseover', 'focusin'], 'product')
export class ProductAttributesComponent extends ProductMixin(
  ContentMixin<ProductAttributesOptions>(LitElement)
) {
  static styles = [ProductAttributeStyles];

  @subscribe()
  protected stylesSetter$ = this.options$.pipe(
    tap((options) => {
      if (options.columnCount) {
        this.style.setProperty('--column-count', options.columnCount);
      }
    })
  );

  protected override render(): TemplateResult {
    return html`
      <ul>
        ${Object.keys(this.product?.attributes ?? {}).map(
          (key) => html`<li>
            <div>${this.product?.attributeNames?.[key]}</div>
            <div>${this.product?.attributes?.[key]}</div>
          </li>`
        )}
      </ul>
    `;
  }
}
