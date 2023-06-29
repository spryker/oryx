import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import {
  Suggestion,
  SuggestionField,
  SuggestionRendererService,
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
import { query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html } from 'lit/static-html.js';
import { BehaviorSubject, switchMap } from 'rxjs';
import { SearchBoxOptions, SearchBoxProperties } from './box.model';
import { baseStyles, searchBoxStyles } from './styles';

@defaultOptions({
  minChars: 2,
  [SuggestionField.Suggestions]: {
    max: 5,
  },
  [SuggestionField.Categories]: {
    max: 5,
  },
  [SuggestionField.Products]: {
    max: 5,
  },
  [SuggestionField.Articles]: {
    max: 5,
  },
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

  protected suggestionRendererService = resolve(SuggestionRendererService);
  protected routerService = resolve(RouterService);
  protected semanticLinkService = resolve(SemanticLinkService);
  protected i18nService = resolve(I18nService);

  // TODO: simplify it when we find easier way how to skip emission of initialValue for each observable recreation
  protected query$ = new BehaviorSubject(this.query);
  protected suggestion$ = this.query$.pipe(
    switchMap((query) =>
      this.suggestionRendererService.get(query, this.$options())
    )
  );

  @elementEffect()
  protected queryEffect = effect(() => this.query$.next(this.query));
  protected $raw = computed(() => this.suggestion$);
  protected $suggestion = computed(() => {
    const query = this.query?.trim();
    const options = this.$options();
    const withSuggestion =
      query && (!options.minChars || query.length >= options.minChars);
    const suggestion = withSuggestion ? this.$raw() : null;

    this.toggleAttribute?.('stretched', !this.isNothingFound(suggestion));

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
          placeholder=${ifDefined(this.$placeholder() as string)}
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
          ${this.suggestionRendererService.render(suggestion, {
            ...this.$options(),
            query: this.query,
          })}
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
  }

  protected onTypeahead(event: CustomEvent<SearchEventDetail>): void {
    this.query = event.detail.query;
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

  protected isNothingFound(suggestion: Suggestion | null | undefined): boolean {
    return Object.values(suggestion ?? {}).every(
      (_suggestion) => !_suggestion?.length
    );
  }
}
