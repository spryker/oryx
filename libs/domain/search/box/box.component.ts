import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import {
  LinksSection,
  Suggestion,
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
import { of } from 'rxjs';
import { SearchBoxOptions, SearchBoxProperties } from './box.model';
import { baseStyles, searchBoxStyles } from './styles';

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

  protected suggestionRendererService = resolve(SuggestionRendererService);
  protected routerService = resolve(RouterService);
  protected semanticLinkService = resolve(SemanticLinkService);
  protected i18nService = resolve(I18nService);

  protected $raw = computed(() => {
    const query = this.query?.trim();
    const options = this.$options();
    const withSuggestion =
      query && (!options.minChars || query.length >= options.minChars);

    return withSuggestion
      ? this.suggestionRendererService.getSuggestions<
          LinksSection[] | Suggestion
        >(query, options)
      : of(null);
  });
  protected $suggestion = computed(() => {
    const suggestion = this.$raw();
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

  protected $render = computed(() => this.suggestionRendererService.render?.());

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
          ${this.$render() ?? this.renderDefaultLinks()}
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

  protected renderDefaultLinks(): TemplateResult | void {
    const links = this.$suggestion();

    if (!Array.isArray(links)) {
      return;
    }

    return html`
      <section>
        ${links.map((link) => {
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
        })}
      </section>
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

  protected isNothingFound(
    suggestion: Suggestion | null | undefined | LinksSection[]
  ): boolean {
    if (Array.isArray(suggestion)) {
      return !suggestion.length;
    }

    return Object.values(suggestion ?? {}).every(
      (_suggestion) => !_suggestion.length
    );
  }
}
