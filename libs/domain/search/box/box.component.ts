import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { Product, ProductMediaContainerSize } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import {
  Suggestion,
  SuggestionResource,
  SuggestionService,
} from '@spryker-oryx/search';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  ClearIconPosition,
  SearchEventDetail,
} from '@spryker-oryx/ui/searchbox';
import '@spryker-oryx/ui/typeahead';
import { TypeaheadComponent } from '@spryker-oryx/ui/typeahead';
import {
  computed,
  debounce,
  effect,
  elementEffect,
  hydratable,
  i18n,
  signal,
  signalAware,
  signalProperty,
  Size,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/async-directive';
import { query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { BehaviorSubject, switchMap } from 'rxjs';
import { SearchBoxOptions, SearchBoxProperties } from './box.model';
import { baseStyles, searchBoxStyles } from './styles';

interface LinksSection {
  title?: DirectiveResult;
  options: SuggestionResource[];
  type: SemanticLinkType;
  id?: string;
}

@defaultOptions({
  minChars: 2,
  completionsCount: 5,
  productsCount: 5,
  categoriesCount: 5,
  cmsCount: 0,
})
@hydratable(['mouseover', 'focusin'])
@signalAware()
export class SearchBoxComponent
  extends ContentMixin<SearchBoxOptions>(LitElement)
  implements SearchBoxProperties
{
  static styles = [baseStyles, searchBoxStyles];

  @signalProperty() query = '';

  @query('oryx-typeahead') protected typeahead!: TypeaheadComponent;
  @query('div[slot="option"] > div') protected scrollContainer?: HTMLElement;

  protected suggestionService = resolve(SuggestionService);
  protected routerService = resolve(RouterService);
  protected semanticLinkService = resolve(SemanticLinkService);
  protected i18nService = resolve(I18nService);

  // TODO: simplify it when we find easier way how to skip emission of initialValue for each observable recreation
  protected query$ = new BehaviorSubject(this.query);
  protected suggestion$ = this.query$.pipe(
    switchMap((query) => this.suggestionService.get({ query }))
  );

  @elementEffect()
  protected queryEffect = effect(() => this.query$.next(this.query));
  protected $raw = computed(() => this.suggestion$);
  protected $suggestion = computed(() => {
    const options = this.$options();
    const withSuggestion =
      this.query &&
      (!options.minChars || this.query.length >= options.minChars);
    const getSuggestions = () => {
      const raw = this.$raw();

      return raw
        ? {
            completion: raw.completion.slice(0, options.completionsCount),
            products: raw.products?.slice(0, options.productsCount) ?? [],
            categories: raw.categories.slice(0, options.categoriesCount),
            cmsPages: raw.cmsPages.slice(0, options.cmsCount),
          }
        : null;
    };
    const suggestion = withSuggestion ? getSuggestions() : null;

    this.toggleAttribute?.('stretched', this.hasCompleteData(suggestion));

    return suggestion;
  });

  protected $placeholder = signal(
    this.i18nService.translate(['search', 'search.placeholder'])
  );

  protected $link = computed(() =>
    this.semanticLinkService.get({
      type: SemanticLinkType.ProductList,
      ...(this.query ? { params: { q: this.query } } : {}),
    })
  );

  protected override render(): TemplateResult {
    return html`
      <oryx-typeahead
        @oryx.search=${this.onSearch}
        @oryx.typeahead=${debounce(this.onTypeahead.bind(this), 300)}
        .clearIconPosition=${ClearIconPosition.None}
      >
        <oryx-icon slot="prefix" type="search" size=${Size.Md}></oryx-icon>
        <input
          .value=${this.query ?? ''}
          placeholder=${ifDefined(this.$placeholder())}
        />
        ${this.renderSuggestion()} ${this.renderControls()}
      </oryx-typeahead>
    `;
  }

  protected renderControls(): TemplateResult | void {
    if (!this.query) return;

    return html`
      <oryx-button slot="suffix" type="text">
        <button @click=${this.onClear} @mousedown=${this.muteMousedown}>
          ${i18n('search.box.clear')}
        </button>
      </oryx-button>

      <oryx-icon-button slot="suffix" size=${Size.Sm}>
        <button
          aria-label="Close results"
          @click=${this.onClose}
          @mousedown=${this.muteMousedown}
        >
          <oryx-icon .type=${IconTypes.Close}></oryx-icon>
        </button>
      </oryx-icon-button>
    `;
  }

  protected renderSuggestion(): TemplateResult | void {
    const suggestion = this.$suggestion();

    if (!suggestion) {
      return;
    }

    if (this.isNothingFound(suggestion)) {
      return this.renderNothingFound();
    }

    return html`
      <div slot="option">
        <div @scroll=${debounce(this.onScroll.bind(this), 20)}>
          ${when(this.hasLinks(suggestion), () =>
            this.renderLinksSection(suggestion)
          )}
          ${when(this.hasProducts(suggestion), () =>
            this.renderProductsSection(suggestion)
          )}
        </div>
      </div>
    `;
  }

  protected renderNothingFound(): TemplateResult {
    return html`
      <div slot="empty">
        <oryx-icon .type=${IconTypes.Search}></oryx-icon>
        <span>${i18n('search.box.nothing-found')}</span>
      </div>
    `;
  }

  protected renderLinksSection(suggestion: Suggestion): TemplateResult {
    const links: LinksSection[] = [
      {
        title: i18n('search.box.suggestions'),
        options: suggestion.completion.map((name) => ({
          name,
          params: { q: name },
        })),
        type: SemanticLinkType.ProductList,
      },
      {
        title: i18n('search.box.categories'),
        options: suggestion.categories.map(({ name, idCategory }) => ({
          name,
          idCategory,
        })),
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

  protected renderLink(link: LinksSection): TemplateResult {
    const { title, options, type } = link;

    if (!options.length) {
      return html``;
    }

    return html`
      <h5>${title}</h5>
      <ul>
        ${options.map(
          ({ name, url, idCategory, params }) => html`
            <li>
              <oryx-content-link
                .options=${{ url, type, id: idCategory, params }}
                .content=${{ text: name }}
                close-popover
              ></oryx-content-link>
            </li>
          `
        )}
      </ul>
    `;
  }

  protected renderProductsSection(suggestion: Suggestion): TemplateResult {
    return html`
      <section>
        <h5>${i18n('search.box.products')}</h5>
        ${suggestion.products.map(this.renderProduct)}

        <oryx-button outline @click=${this.onClose}>
          <oryx-content-link
            .options=${{
              type: SemanticLinkType.ProductList,
              params: { q: this.query },
            }}
            .content=${{ text: i18n('search.box.view-all-products') }}
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

  // The oryx-typeahead is using focusin and mousedown events listening inside for
  // managing its opened state.
  // Need to mute this behavior for control buttons to avoid unexpected closing/opening
  // of dropdown with results
  protected muteMousedown(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
  }

  protected onClear(): void {
    this.query = '';
  }

  protected onClose(): void {
    this.typeahead.dispatchEvent(
      new CustomEvent('oryx.close', { bubbles: true, composed: true })
    );
    this.typeahead.removeAttribute('open');
  }

  protected onTypeahead(event: CustomEvent<SearchEventDetail>): void {
    this.query = event.detail.query.trim();
  }

  protected onScroll(): void {
    if (!this.scrollContainer) {
      this.removeAttribute('scrollable-top');
      this.removeAttribute('scrollable-bottom');

      return;
    }

    const { height } = this.scrollContainer.getBoundingClientRect();

    this.toggleAttribute(
      'scrollable-top',
      !!Math.ceil(this.scrollContainer.scrollTop)
    );
    this.toggleAttribute(
      'scrollable-bottom',
      this.scrollContainer.scrollHeight >
        Math.ceil(height + this.scrollContainer.scrollTop)
    );
  }

  protected onSearch(): void {
    const link = this.$link();

    if (!link) {
      return;
    }

    this.routerService.navigate(link);
    this.onClose();
  }

  protected hasLinks(suggestion: Suggestion | null): boolean {
    return !!(
      suggestion?.completion.length ||
      suggestion?.cmsPages.length ||
      suggestion?.categories.length
    );
  }

  protected hasProducts(suggestion: Suggestion | null): boolean {
    return !!suggestion?.products?.length;
  }

  protected isNothingFound(suggestion: Suggestion | null): boolean {
    return !this.hasLinks(suggestion) && !this.hasProducts(suggestion);
  }

  protected hasCompleteData(suggestion: Suggestion | null): boolean {
    return this.hasLinks(suggestion) && this.hasProducts(suggestion);
  }
}
