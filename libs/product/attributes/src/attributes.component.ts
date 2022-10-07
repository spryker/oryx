import { ContentController } from '@spryker-oryx/experience';
import { asyncValue, subscribe } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { map, tap } from 'rxjs';
import { ProductAttributesComponentOptions } from './attributes.model';
import { ProductAttributeStyles } from './attributes.styles';

interface ProductAttributeItem {
  key: string;
  label: string;
  value: string;
}

@hydratable()
export class ProductAttributesComponent extends ProductComponentMixin<ProductAttributesComponentOptions>() {
  static styles = ProductAttributeStyles;

  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();

  @subscribe()
  protected optionsObserver = this.options$.pipe(
    tap((options) => {
      if (!options?.columnCount) {
        this.removeAttribute('style');
        return;
      }
      this.setAttribute('style', `--column-count: ${options.columnCount}`);
    })
  );

  protected attributes$ = this.product$.pipe(
    map((product) => {
      if (!product) {
        return [];
      }
      const { attributes, attributeNames = {} } = product;
      const attributesList: ProductAttributeItem[] = [];
      for (const attributesKey in attributes) {
        attributesList.push({
          key: attributesKey,
          label: attributeNames[attributesKey],
          value: attributes[attributesKey],
        });
      }
      return attributesList;
    })
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.attributes$, (attributes) => {
        return html`
          <ul>
            ${repeat(
              attributes,
              (attribute) => attribute.key,
              (attribute) => html`
                <li>
                  <div>${attribute.label}</div>
                  <div>${attribute.value}</div>
                </li>
              `
            )}
          </ul>
        `;
      })}
    `;
  }
}
