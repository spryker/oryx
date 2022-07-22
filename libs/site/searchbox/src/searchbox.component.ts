import { hydratable } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, subscribe } from '@spryker-oryx/lit-rxjs';
import { Suggestion, SuggestionService } from '@spryker-oryx/site';
import { ClearIconPosition } from '@spryker-oryx/ui/searchbox';
import '@spryker-oryx/ui/typeahead';
import { LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { html } from 'lit/static-html.js';
import {
  BehaviorSubject,
  debounce,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import {
  QueryControlsController,
  RenderSuggestionController,
  ScrollingAreaController,
} from './controllers';
import {
  SiteSearchboxOptions,
  SiteSearchboxProperties,
  SiteSearchboxTranslations,
} from './searchbox.model';
import { baseSearchboxStyles, searchboxStyles } from './styles';

export const TAG_NAME = 'site-searchbox';

@hydratable()
export class SearchboxComponent
  extends LitElement
  implements SiteSearchboxProperties, SiteSearchboxTranslations
{
  static styles = [baseSearchboxStyles, searchboxStyles];

  //TODO: rename to defaultOptions and merge them with eb options
  private options: SiteSearchboxOptions = {
    minChars: 2,
  };

  protected suggestionService = resolve(SuggestionService);

  protected scrollingAreaController = new ScrollingAreaController(this);
  protected queryControlsController = new QueryControlsController(this);
  protected renderSuggestionController = new RenderSuggestionController(this);

  protected triggerInputValue$ = new BehaviorSubject('');

  protected suggestion$ = this.triggerInputValue$.pipe(
    debounce(() => timer(300)),
    map((q) => q.trim()),
    distinctUntilChanged(),
    switchMap((query) => {
      if (!this.options.minChars || query.length >= this.options.minChars) {
        return this.suggestionService.get({ query });
      }

      return of(null);
    }),
    tap((suggestion) => {
      this.notFound =
        this.renderSuggestionController.isNothingFound(suggestion);
    })
  );

  @subscribe()
  protected scrollEvent = fromEvent(
    this as EventTarget,
    'containerScroll'
  ).pipe(
    debounce(() => timer(20)),
    tap(() => {
      this.scrollingAreaController.setScrollAttributes(
        this.scrollContainerRef.value as HTMLElement
      );
    })
  );

  @property({ type: String }) query = '';
  @property({ type: Boolean, reflect: true, attribute: 'not-found' })
  protected notFound = false;

  // Translations
  // Temporary solution. Need to replace by props or options
  placeholder = 'Search';

  clearButtonTitle = 'Clear';
  closeButtonArialLabel = 'Close results';

  nothingFoundText = 'Nothing found…';

  completionTitle = 'Search suggestions';
  categoriesTitle = 'In categories';
  cmsTitle = 'In CMS pages';
  productsTitle = 'Products';
  viewAllProductsButtonTitle = 'View all products';

  protected firstUpdated(
    properties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (properties.has('query')) {
      (this.inputRef.value as HTMLInputElement).value = this.query;
      this.triggerInputValue$.next(this.query);
    }
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('oryx.clear', this.clear);
    this.addEventListener('oryx.close', this.close);
  }

  disconnectedCallback(): void {
    this.removeEventListener('oryx.clear', this.clear);
    this.removeEventListener('oryx.close', this.close);

    super.disconnectedCallback();
  }

  constructor() {
    super();

    this.clear = this.clear.bind(this);
    this.close = this.close.bind(this);
    this.dispatchContainerScroll = this.dispatchContainerScroll.bind(this);
  }

  protected inputRef: Ref<HTMLInputElement> = createRef();
  protected scrollContainerRef: Ref<HTMLElement> = createRef();

  protected clear(e: Event): void {
    e.stopPropagation();
    const input = this.inputRef.value as HTMLInputElement;

    input.value = '';
    this.query = '';
    this.triggerInputValue$.next('');
  }

  protected close(): void {
    this.renderRoot.querySelector('oryx-typeahead')?.removeAttribute('open');
  }

  protected onTypeahead(): void {
    this.query = (this.inputRef.value as HTMLInputElement).value;
    this.triggerInputValue$.next(this.query);
  }

  protected dispatchContainerScroll(e: Event): void {
    e.target?.dispatchEvent(
      new CustomEvent('containerScroll', { bubbles: true, composed: true })
    );
  }

  protected renderSuggestion(suggestion: Suggestion): TemplateResult {
    if (this.renderSuggestionController.isNothingFound(suggestion)) {
      return this.renderSuggestionController.renderNothingFound();
    }

    return html`
      <div slot="option">
        <div
          @scroll=${this.dispatchContainerScroll}
          ${ref(this.scrollContainerRef)}
        >
          ${this.renderSuggestionController.renderLinksSection(suggestion)}
          ${this.renderSuggestionController.renderProductsSection(suggestion)}
        </div>
      </div>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-typeahead
        clearIconPosition=${ClearIconPosition.NONE}
        @oryx.typeahead=${this.onTypeahead}
      >
        <input placeholder=${this.placeholder} ${ref(this.inputRef)} />
        ${asyncValue(this.suggestion$, (suggestion) =>
          this.renderSuggestion(suggestion)
        )}
        ${this.queryControlsController.renderControls()}
      </oryx-typeahead>
    `;
  }
}
