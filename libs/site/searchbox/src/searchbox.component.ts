import { hydratable } from '@spryker-oryx/core';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, subscribe } from '@spryker-oryx/lit-rxjs';
import { Suggestion, SuggestionService } from '@spryker-oryx/site';
import { ClearIconPosition } from '@spryker-oryx/ui/searchbox';
import '@spryker-oryx/ui/typeahead';
import { TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { html } from 'lit/static-html.js';
import {
  BehaviorSubject,
  combineLatest,
  debounce,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import {
  QueryControlsController,
  RenderSuggestionController,
  ScrollingAreaController,
} from './controllers';
import {
  SiteSearchboxOptions,
  SiteSearchboxProperties,
} from './searchbox.model';
import { baseSearchboxStyles, searchboxStyles } from './styles';

export const TAG_NAME = 'site-searchbox';

@hydratable()
export class SearchboxComponent
  extends ComponentMixin<SiteSearchboxOptions>()
  implements SiteSearchboxProperties
{
  static styles = [baseSearchboxStyles, searchboxStyles];

  private defaultOptions: SiteSearchboxOptions = {
    minChars: 2,
    completionsCount: 5,
    productsCount: 6,
    categoriesCount: 5,
    cmsCount: 5,
  };

  protected contentController = new ContentController(this);
  protected suggestionService = resolve(SuggestionService);
  protected options$ = this.contentController.getOptions().pipe(
    map((options) => ({ ...this.defaultOptions, ...options })),
    shareReplay({ refCount: true, bufferSize: 1 }),
    tap((options) => this.applyInputTexts(options))
  );

  protected scrollingAreaController = new ScrollingAreaController(this);
  protected queryControlsController = new QueryControlsController();
  protected renderSuggestionController = new RenderSuggestionController();

  protected triggerInputValue$ = new BehaviorSubject('');

  protected suggestion$ = this.triggerInputValue$.pipe(
    debounce(() => timer(300)),
    map((q) => q.trim()),
    distinctUntilChanged(),
    withLatestFrom(this.options$),
    switchMap(([query, options]) => {
      const {
        minChars,
        completionsCount,
        productsCount,
        categoriesCount,
        cmsCount,
      } = options;

      if (!minChars || query.length >= minChars) {
        return this.suggestionService.get({ query }).pipe(
          map((raw) => {
            const suggestion = raw
              ? {
                  completion: raw.completion.slice(0, completionsCount),
                  products: raw.products?.slice(0, productsCount) ?? [],
                  categories: raw.categories.slice(0, categoriesCount),
                  cmsPages: raw.cmsPages.slice(0, cmsCount),
                }
              : raw;

            return { suggestion, options };
          })
        );
      }

      return of({ suggestion: null, options });
    }),
    tap(({ suggestion }) => {
      this.notFound =
        this.renderSuggestionController.isNothingFound(suggestion);
    })
  );

  protected controlButtons$ = combineLatest([
    this.options$,
    this.triggerInputValue$,
  ]).pipe(map(([options, query]) => ({ options, showButtons: !!query })));

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

  protected firstUpdated(): void {
    if (this.query) {
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

  protected applyInputTexts(options: SiteSearchboxOptions): void {
    const { placeholder } = options;

    if (placeholder) {
      this.inputRef?.value?.setAttribute('placeholder', placeholder);
    }
  }

  protected renderSuggestion(
    suggestion: Suggestion | null,
    options: SiteSearchboxOptions
  ): TemplateResult {
    if (!suggestion) {
      return html``;
    }

    if (this.renderSuggestionController.isNothingFound(suggestion)) {
      return this.renderSuggestionController.renderNothingFound(options);
    }

    return html`
      <div slot="option">
        <div
          @scroll=${this.dispatchContainerScroll}
          ${ref(this.scrollContainerRef)}
        >
          ${this.renderSuggestionController.renderLinksSection(
            suggestion,
            options
          )}
          ${this.renderSuggestionController.renderProductsSection(
            suggestion,
            options
          )}
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
        <input ${ref(this.inputRef)} placeholder="Search" />
        ${asyncValue(
          this.suggestion$,
          ({ suggestion, options }) =>
            html`${this.renderSuggestion(suggestion, options)}`
        )}
        ${asyncValue(this.controlButtons$, ({ options, showButtons }) =>
          showButtons
            ? this.queryControlsController.renderControls(options)
            : html``
        )}
      </oryx-typeahead>
    `;
  }
}
