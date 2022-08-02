import { Product } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { Suggestion, SuggestionResource } from '../../../src';
import { SiteSearchboxOptions } from '../searchbox.model';

interface LinksSection {
  title?: string;
  options: SuggestionResource[];
  type: SemanticLinkType;
}

export class RenderSuggestionController {
  protected processCompletions(completions: string[]): SuggestionResource[] {
    //TODO: url generation PLP + ?q=${completion}
    return completions.map((name) => ({ name, url: `?q=${name}` }));
  }

  protected renderLink({ title, options, type }: LinksSection): TemplateResult {
    if (!options.length) {
      return html``;
    }

    return html`
      <h5>${title}</h5>
      <ul>
        ${options.map(
          ({ name, url }) => html`
            <li>
              <content-link
                .options="${{
                  type,
                  id: url,
                  text: name,
                }}"
              ></content-link>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderNothingFound({
    nothingFoundText,
  }: SiteSearchboxOptions): TemplateResult {
    return html`
      <div slot="empty">
        <oryx-icon type="search"></oryx-icon>
        <span>${nothingFoundText || 'Nothing found…'}</span>
      </div>
    `;
  }

  renderLinksSection(
    suggestion: Suggestion,
    options: SiteSearchboxOptions
  ): TemplateResult {
    const links: LinksSection[] = [
      {
        title: options.completionTitle || 'Search suggestions',
        options: this.processCompletions(suggestion.completion),
        type: SemanticLinkType.ProductList,
      },
      {
        title: options.categoriesTitle || 'In categories',
        options: suggestion.categories,
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
      >
        <product-media .product=${product}></product-media>
        <product-title .product=${product}></product-title>
        <product-price .product=${product}></product-price>
      </content-link>
    `;
  }

  renderProductsSection(
    suggestion: Suggestion,
    options: SiteSearchboxOptions
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
