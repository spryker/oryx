import { Product, ProductMediaContainerSize } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { Suggestion, SuggestionResource } from '../../../src';
import { SearchBoxOptions } from '../box.model';

interface LinksSection {
  title?: string;
  options: SuggestionResource[];
  type: SemanticLinkType;
}

export class RenderSuggestionController {
  protected processCompletions(completions: string[]): SuggestionResource[] {
    return completions.map((name) => ({ name, params: { q: name } }));
  }

  protected renderLink({ title, options, type }: LinksSection): TemplateResult {
    if (!options.length) {
      return html``;
    }

    return html`
      <h5>${title}</h5>
      <ul>
        ${options.map(
          ({ name, url, params }) => html`
            <li>
              <content-link
                .options="${{
                  type,
                  id: url ?? '',
                  params: params ?? null,
                  text: name,
                }}"
                close-popover
              ></content-link>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderNothingFound({ nothingFoundText }: SearchBoxOptions): TemplateResult {
    return html`
      <div slot="empty">
        <oryx-icon type="search"></oryx-icon>
        <span>${nothingFoundText || 'Nothing found…'}</span>
      </div>
    `;
  }

  renderLinksSection(
    suggestion: Suggestion,
    options: SearchBoxOptions
  ): TemplateResult {
    const links: LinksSection[] = [
      {
        title: options.completionTitle || 'Search suggestions',
        options: this.processCompletions(suggestion.completion),
        type: SemanticLinkType.ProductList,
      },
      {
        title: options.categoriesTitle || 'In categories',
        options: suggestion.categories.map(({ name, url, idCategory }) => ({
          name,
          url: idCategory,
        })) as SuggestionResource[],
        type: SemanticLinkType.Category,
      },
      {
        title: options.cmsTitle || 'In CMS pages',
        options: suggestion.cmsPages,
        type: SemanticLinkType.Page,
      },
    ];

    return html` <section>${links.map((l) => this.renderLink(l))}</section> `;
  }

  protected renderProduct(product: Product): TemplateResult {
    return html`
      <content-link
        class="product"
        .options="${{
          type: SemanticLinkType.Product,
          id: product.sku,
          label: product.name,
        }}"
        close-popover
      >
        <oryx-product-media
          .sku=${product.sku}
          .options=${{ container: ProductMediaContainerSize.Thumbnail }}
        ></oryx-product-media>
        <oryx-product-title .sku=${product.sku}></oryx-product-title>
        <oryx-product-price
          .sku=${product.sku}
          .options=${{ enableVatMessage: false }}
        ></oryx-product-price>
      </content-link>
    `;
  }

  renderProductsSection(
    suggestion: Suggestion,
    options: SearchBoxOptions
  ): TemplateResult {
    return html`
      <section>
        <h5>${options.productsTitle || 'Products'}</h5>
        ${suggestion.products.map(this.renderProduct)}
        <!-- TODO link to PLP -->
        <oryx-button outline>
          <a href="#"
            >${options.viewAllProductsButtonTitle || 'View all products'}</a
          >
        </oryx-button>
      </section>
    `;
  }
}
