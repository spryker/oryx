import { Product, ProductMediaContainerSize } from '@spryker-oryx/product';
import { SemanticLinkType } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { html } from 'lit/static-html.js';
import { Suggestion, SuggestionResource } from '../../../src';
import { SearchBoxProperties } from '../box.model';

interface LinksSection {
  title?: DirectiveResult;
  options: SuggestionResource[];
  type: SemanticLinkType;
}

export class RenderSuggestionController {
  constructor(protected host: LitElement & SearchBoxProperties) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  protected onViewAllClick(e: Event): void {
    e.target?.dispatchEvent(
      new CustomEvent('oryx.close', { bubbles: true, composed: true })
    );
  }

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
              <oryx-content-link
                .options="${{
                  type,
                  id: url ?? '',
                  params: params ?? null,
                  text: name,
                }}"
                close-popover
              ></oryx-content-link>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderNothingFound(): TemplateResult {
    return html`
      <div slot="empty">
        <oryx-icon .type=${IconTypes.Search}></oryx-icon>
        <span>${i18n('search.box.nothing-found')}</span>
      </div>
    `;
  }

  renderLinksSection(suggestion: Suggestion): TemplateResult {
    const links: LinksSection[] = [
      {
        title: i18n('search.box.suggestions'),
        options: this.processCompletions(suggestion.completion),
        type: SemanticLinkType.ProductList,
      },
      {
        title: i18n('search.box.categories'),
        options: suggestion.categories.map(({ name, idCategory }) => ({
          name,
          url: idCategory,
        })) as SuggestionResource[],
        type: SemanticLinkType.Category,
      },
      {
        title: i18n('search.box.content'),
        options: suggestion.cmsPages,
        type: SemanticLinkType.Page,
      },
    ];

    return html` <section>${links.map((l) => this.renderLink(l))}</section> `;
  }

  protected renderProduct(product: Product): TemplateResult {
    return html`
      <oryx-content-link
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
          .options=${{ enableTaxMessage: false }}
        ></oryx-product-price>
      </oryx-content-link>
    `;
  }

  renderProductsSection(suggestion: Suggestion): TemplateResult {
    return html`
      <section>
        <h5>${i18n('search.box.products')}</h5>
        ${suggestion.products.map(this.renderProduct)}

        <oryx-button outline @click=${(e: Event) => this.onViewAllClick(e)}>
          <oryx-content-link
            .options="${{
              type: SemanticLinkType.ProductList,
              text: i18n('search.box.view-all-products'),
              params: { q: this.host.query },
            }}"
          ></oryx-content-link>
        </oryx-button>
      </section>
    `;
  }
}
