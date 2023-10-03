import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouteType, RouterService } from '@spryker-oryx/router';
import {
  Suggestion,
  SuggestionField,
  SuggestionRendererService,
} from '@spryker-oryx/search';
import { LinkService } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SearchEventDetail } from '@spryker-oryx/ui/searchbox';
import '@spryker-oryx/ui/typeahead';
import { TypeaheadComponent } from '@spryker-oryx/ui/typeahead';
import {
  Size,
  computed,
  debounce,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html } from 'lit/static-html.js';
import { BehaviorSubject, switchMap } from 'rxjs';
import { searchBoxStyles } from './';
import { SearchBoxOptions, SearchBoxProperties } from './box.model';

@defaultOptions({
  minChars: 2,
  [SuggestionField.Suggestions]: {
    max: 5,
  },
  [SuggestionField.Categories]: {
    max: 5,
    icon: 'category',
  },
  [SuggestionField.Contents]: {
    max: 5,
    icon: 'description',
  },
  [SuggestionField.Products]: {
    max: 5,
  },
})
@hydrate({ event: ['mouseover', 'focusin'] })
@signalAware()
export class SearchBoxComponent
  extends ContentMixin<SearchBoxOptions>(LitElement)
  implements SearchBoxProperties
{
  static styles = [searchBoxStyles];

  @signalProperty() query = '';

  @query('oryx-typeahead') protected typeahead!: TypeaheadComponent;
  @query('input') protected input!: HTMLInputElement;

  protected suggestionRendererService = resolve(SuggestionRendererService);
  protected routerService = resolve(RouterService);
  protected semanticLinkService = resolve(LinkService);

  // TODO: simplify it when we find easier way how to skip emission of initialValue for each observable recreation
  protected query$ = new BehaviorSubject(this.query);
  protected suggestion$ = this.query$.pipe(
    switchMap((query) =>
      this.suggestionRendererService.get(query, this.$options())
    )
  );

  protected $link = computed(() =>
    this.semanticLinkService.get({
      type: RouteType.ProductList,
      ...(this.query ? { params: { q: this.query } } : {}),
    })
  );

  protected $raw = computed(() => this.suggestion$);
  protected $suggestion = computed(() => {
    const query = this.query?.trim();
    const options = this.$options();
    const withSuggestion =
      query && (!options.minChars || query.length >= options.minChars);

    return withSuggestion ? this.$raw() : null;
  });

  connectedCallback(): void {
    super.connectedCallback();

    if (this.input?.value) {
      this.query = this.input?.value;
    }
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-typeahead
        @oryx.search=${this.onSearch}
        @oryx.typeahead=${this.onTypeahead}
        .clearIcon=${IconTypes.Close}
        ?float=${this.$options().float}
        repeatable="input,change"
      >
        <oryx-icon slot="prefix" type="search" size=${Size.Md}></oryx-icon>
        <input
          .value=${this.query ?? ''}
          placeholder=${ifDefined(this.i18n(['search', 'search.placeholder']))}
          repeatable="focusin"
        />
        ${this.renderSuggestion()}
        <oryx-site-navigation-button
          slot="trigger"
          icon="${IconTypes.Search}"
        ></oryx-site-navigation-button>
      </oryx-typeahead>
    `;
  }

  protected renderSuggestion(): TemplateResult | void {
    const suggestion = this.$suggestion();

    if (!suggestion) return;

    if (this.isNothingFound(suggestion)) return this.renderNothingFound();

    return html`<div slot="option">
      ${this.suggestionRendererService.render(suggestion, {
        ...this.$options(),
        query: this.query,
      })}
    </div> `;
  }

  protected renderNothingFound(): TemplateResult {
    return html`
      <div slot="empty">
        ${this.i18n('search.box.no-results-<query>', { query: this.query })}
      </div>
    `;
  }

  protected onClear(): void {
    this.query = '';
  }

  protected onClose(): void {
    this.typeahead.dispatchEvent(
      new CustomEvent('oryx.close', { bubbles: true, composed: true })
    );
  }

  protected onTypeahead(event: CustomEvent<SearchEventDetail>): void {
    this.query = event.detail.query;

    this.assignSuggestionQuery();
  }

  protected assignSuggestionQuery = debounce(() => {
    this.query$.next(this.query);
  }, 300);

  protected onSearch(): void {
    const link = this.$link();

    if (!link) {
      return;
    }

    this.routerService.navigate(link);
    this.onClose();
  }

  protected isNothingFound(suggestion: Suggestion | null | undefined): boolean {
    return Object.values(suggestion ?? {}).every(
      (_suggestion) => !_suggestion?.length
    );
  }
}
