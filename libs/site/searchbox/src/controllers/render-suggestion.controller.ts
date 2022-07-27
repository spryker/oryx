import { Product } from '@spryker-oryx/product';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { Suggestion, SuggestionResource } from '../../../src';
import { SiteSearchboxOptions } from '../searchbox.model';

interface LinksSection {
  title?: string;
  options: SuggestionResource[];
}

export class RenderSuggestionController {
  protected hasLinks({
    completion,
    cmsPages,
    categories,
  }: Suggestion): boolean {
    return !!(completion.length || cmsPages.length || categories.length);
  }

  protected hasProducts(suggestion: Suggestion): boolean {
    return !!suggestion.products.length;
  }

  isNothingFound(suggestion: Suggestion | null): boolean {
    return (
      !!suggestion &&
      !this.hasLinks(suggestion) &&
      !this.hasProducts(suggestion)
    );
  }

  protected processCompletions(completions: string[]): SuggestionResource[] {
    //TODO: url generation
    return completions.map((name) => ({ name, url: '/' }));
  }

  protected renderLink({ title, options }: LinksSection): TemplateResult {
    if (!options.length) {
      return html``;
    }

    return html`
      <h5>${title}</h5>
      <ul>
        ${options.map(
          ({ name, url }) => html`
            <li>
              <oryx-link>
                <a href=${url}>${name}</a>
              </oryx-link>
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
    if (!this.hasLinks(suggestion)) {
      return html``;
    }

    const links: LinksSection[] = [
      {
        title: options.completionTitle || 'Search suggestions',
        options: this.processCompletions(suggestion.completion),
      },
      {
        title: options.categoriesTitle || 'In categories',
        options: suggestion.categories,
      },
      {
        title: options.cmsTitle || 'In CMS pages',
        options: suggestion.cmsPages,
      },
    ];

    return html` <section>${links.map((l) => this.renderLink(l))}</section> `;
  }

  protected renderProduct(product: Product): TemplateResult {
    return html`
      <a class="product" href=${product.sku ?? '#'}>
        <product-media .product=${product}></product-media>
        <product-title .product=${product}></product-title>
        <product-price .product=${product}></product-price>
      </a>
    `;
  }

  renderProductsSection(
    suggestion: Suggestion,
    options: SiteSearchboxOptions
  ): TemplateResult {
    if (!this.hasProducts(suggestion)) {
      return html``;
    }

    return html`
      <section>
        <h5>${options.productsTitle || 'Products'}</h5>
        ${suggestion.products.map(this.renderProduct)}
        <!-- TODO link to search page -->
        <oryx-button outline>
          <a href="#"
            >${options.viewAllProductsButtonTitle || 'View all products'}</a
          >
        </oryx-button>
      </section>
    `;
  }
}
