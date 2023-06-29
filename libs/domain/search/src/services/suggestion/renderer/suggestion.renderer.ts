import { Product, ProductMediaContainerSize } from '@spryker-oryx/product';
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
      <section>
        <h5>${i18n('search.box.products')}</h5>
        ${products?.slice(0, params.max)?.map(renderProduct)}

        <oryx-button
          outline
          @click=${(event: Event) =>
            event.target?.dispatchEvent(
              new CustomEvent('oryx.close', { bubbles: true, composed: true })
            )}
        >
          <oryx-content-link
            .options=${{
              type: SemanticLinkType.ProductList,
              params: { q: query },
            }}
            .content=${{ text: i18n('search.box.view-all-products') }}
          ></oryx-content-link>
        </oryx-button>
      </section>
    `;
  };
  const renderProduct = (product: Product): TemplateResult => {
    return html`
      <oryx-content-link
        class="product"
        .options=${{
          type: SemanticLinkType.Product,
          id: product.sku,
          label: product.name,
        }}
        close-popover
      >
        <oryx-product-media
          .sku=${product.sku}
          .options=${{ container: ProductMediaContainerSize.Thumbnail }}
        ></oryx-product-media>
        <oryx-product-title .sku=${product.sku}></oryx-product-title>
        <oryx-product-price
          .sku=${product.sku}
          .options=${{ enableTaxMessage: false }}
        ></oryx-product-price>
      </oryx-content-link>
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

  const { title, max, type } = params;

  return html`
    <section>
      <h5>${i18n(title ?? '')}</h5>
      <ul>
        ${suggestion.slice(0, max).map(
          ({ name, url, id, params }) => html`
            <li>
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
            </li>
          `
        )}
      </ul>
    </section>
  `;
};
