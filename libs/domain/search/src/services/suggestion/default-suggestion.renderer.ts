import { inject } from '@spryker-oryx/di';
import { Product, ProductMediaContainerSize } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { map, Observable } from 'rxjs';
import { Suggestion } from '../../models';
import {
  LinksSection,
  SuggestionRenderer,
  SuggestionRendererOptions,
} from './suggestion-renderer.service';
import { SuggestionService } from './suggestion.service';

export class DefaultSuggestionRenderer implements SuggestionRenderer {
  constructor(protected suggestionService = inject(SuggestionService)) {}

  getSuggestions<T = Suggestion>(
    data: SuggestionRendererOptions & { query: string }
  ): Observable<T | null> {
    const { query, ...options } = data;

    return this.suggestionService.get({ query }).pipe(
      map((raw) =>
        raw
          ? {
              completion: raw.completion?.slice(0, options.completionsCount),
              products: raw.products?.slice(0, options.productsCount) ?? [],
              categories: raw.categories?.slice(0, options.categoriesCount),
            }
          : null
      )
    ) as unknown as Observable<T | null>;
  }

  render(suggestion: Suggestion | null, query?: string): TemplateResult {
    return html`
      ${when(this.hasLinks(suggestion), () =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.renderLinksSection(suggestion!)
      )}
      ${when(this.hasProducts(suggestion), () =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.renderProductsSection(suggestion!, query)
      )}
    `;
  }

  protected renderLinksSection(suggestion: Suggestion): TemplateResult {
    const links: LinksSection[] = [
      {
        title: i18n('search.box.suggestions'),
        options:
          suggestion.completion?.map((name) => ({
            name,
            params: { q: name },
          })) ?? [],
        type: SemanticLinkType.ProductList,
      },
      {
        title: i18n('search.box.categories'),
        options:
          suggestion.categories?.map(({ name, idCategory }) => ({
            name,
            url: idCategory,
          })) ?? [],
        type: SemanticLinkType.Category,
      },
    ];

    return html` <section>${links.map((l) => this.renderLink(l))}</section> `;
  }

  protected renderLink(link: LinksSection): TemplateResult {
    const { title, options, type } = link;

    if (!options.length) {
      return html``;
    }

    return html`
      <h5>${title}</h5>
      <ul>
        ${options.map(
          ({ name, url, params }) => html`
            <li>
              <oryx-content-link
                .options=${{
                  type,
                  id: url ?? '',
                  params: params ?? null,
                  text: name,
                }}
                close-popover
              ></oryx-content-link>
            </li>
          `
        )}
      </ul>
    `;
  }

  protected renderProductsSection(
    suggestion: Suggestion,
    query?: string
  ): TemplateResult {
    return html`
      <section>
        <h5>${i18n('search.box.products')}</h5>
        ${suggestion.products?.map(this.renderProduct)}

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
              text: i18n('search.box.view-all-products'),
              params: { q: query },
            }}
          ></oryx-content-link>
        </oryx-button>
      </section>
    `;
  }

  protected renderProduct(product: Product): TemplateResult {
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
  }

  protected hasLinks(suggestion: Suggestion | null | undefined): boolean {
    return !!(
      suggestion?.completion?.length ||
      suggestion?.cmsPages?.length ||
      suggestion?.categories?.length
    );
  }

  protected hasProducts(suggestion: Suggestion | null | undefined): boolean {
    return !!suggestion?.products?.length;
  }

  protected hasCompleteData(
    suggestion: Suggestion | null | undefined
  ): boolean {
    return this.hasLinks(suggestion) && this.hasProducts(suggestion);
  }
}
