import { Product } from '@spryker-oryx/product';
import { ProductCardOptions } from '@spryker-oryx/product/card';
import { SemanticLinkType } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { SuggestionResource } from '../../../models';
import { SuggestionRenderer } from './suggestion-renderer.service';

export const productSuggestionRenderer: SuggestionRenderer<Product[]> = (
  products,
  params
) => {
  const renderProductsSection = (query?: string): TemplateResult => {
    return html`
      <section class="products">
        ${products?.slice(0, params.max)?.map(renderProduct)}

        <oryx-content-link
          .options=${{
            type: SemanticLinkType.ProductList,
            params: { q: query },
            button: true,
          }}
          .content=${{ text: i18n('search.box.view-all-products') }}
        ></oryx-content-link>
      </section>
    `;
  };
  const renderProduct = (product: Product): TemplateResult => {
    return html`
      <oryx-product-card
        .sku=${product.sku}
        .options=${{ template: 'list' } as ProductCardOptions}
        close-popover
      ></oryx-product-card>
    `;
  };

  return html`
    ${when(products?.length, () => renderProductsSection(params.query))}
  `;
};

export const defaultSuggestionRenderer: SuggestionRenderer<
  SuggestionResource[]
> = (suggestion, params) => {
  if (!suggestion?.length) {
    return;
  }

  const { title, icon, max, type } = params;

  return html`
    <section>
      <h5>
        ${when(icon, () => html`<oryx-icon .type=${icon}></oryx-icon>`)}
        ${i18n(title ?? '')}
      </h5>

      ${suggestion.slice(0, max).map(
        ({ name, url, id, params }) => html`
          <oryx-content-link
            .options=${{
              type,
              url,
              id,
              params,
            }}
            .content=${{ text: name }}
            close-popover
          ></oryx-content-link>
        `
      )}
    </section>
  `;
};
