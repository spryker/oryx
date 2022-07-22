import { Product } from '@spryker-oryx/product';
import { LitElement, ReactiveController, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { Suggestion, SuggestionResource } from '../../../src';
import { SuggestionTranslations } from '../searchbox.model';

interface LinksSection {
  title: string;
  options: SuggestionResource[];
}

export class RenderSuggestionController implements ReactiveController {
  hostConnected?(): void;

  constructor(protected host: SuggestionTranslations & LitElement) {
    this.host.addController(this);
  }

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

  renderNothingFound(): TemplateResult {
    return html`
      <div slot="empty">
        <oryx-icon type="search"></oryx-icon>
        <span>${this.host.nothingFoundText}</span>
      </div>
    `;
  }

  renderLinksSection(suggestion: Suggestion): TemplateResult {
    if (!this.hasLinks(suggestion)) {
      return html``;
    }

    const links: LinksSection[] = [
      {
        title: this.host.completionTitle,
        options: this.processCompletions(suggestion.completion),
      },
      { title: this.host.categoriesTitle, options: suggestion.categories },
      { title: this.host.cmsTitle, options: suggestion.cmsPages },
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

  renderProductsSection(suggestion: Suggestion): TemplateResult {
    if (!this.hasProducts(suggestion)) {
      return html``;
    }

    return html`
      <section>
        <h5>${this.host.productsTitle}</h5>
        ${suggestion.products.map(this.renderProduct)}
        <!-- TODO link to search page -->
        <oryx-button outline>
          <a href="#">${this.host.viewAllProductsButtonTitle}</a>
        </oryx-button>
      </section>
    `;
  }
}
