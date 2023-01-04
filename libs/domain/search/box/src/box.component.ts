import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { Suggestion, SuggestionService } from '@spryker-oryx/search';
import '@spryker-oryx/ui/typeahead';
import { asyncValue, hydratable, subscribe } from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import {
  catchError,
  combineLatest,
  debounce,
  defer,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { SearchBoxOptions, SearchBoxProperties } from './box.model';
import {
  QueryControlsController,
  RenderSuggestionController,
  ScrollingAreaController,
} from './controllers';
import { baseStyles, searchboxStyles } from './styles';

@hydratable('focusin')
export class SearchBoxComponent
  extends ComponentMixin<SearchBoxOptions>()
  implements SearchBoxProperties
{
  static styles = [baseStyles, searchboxStyles];

  private defaultOptions: SearchBoxOptions = {
    minChars: 2,
    completionsCount: 5,
    productsCount: 5,
    categoriesCount: 5,
    cmsCount: 0,
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

  protected triggerInputValue$ = new Subject<string>();

  protected suggestion$ = this.triggerInputValue$.pipe(
    debounce(() => timer(300)),
    map((q) => q.trim()),
    distinctUntilChanged(),
    withLatestFrom(this.options$),
    switchMap(([query, options]) => {
      if (query && (!options.minChars || query.length >= options.minChars)) {
        return this.suggestionService.get({ query }).pipe(
          map((raw) => {
            const suggestion = raw
              ? {
                  completion: raw.completion.slice(0, options.completionsCount),
                  products: raw.products?.slice(0, options.productsCount) ?? [],
                  categories: raw.categories.slice(0, options.categoriesCount),
                  cmsPages: raw.cmsPages.slice(0, options.cmsCount),
                }
              : raw;

            return { suggestion, options };
          })
        );
      }

      return of({ suggestion: null, options });
    }),
    tap(({ suggestion }) => {
      this.stretched = this.hasCompleteData(suggestion);
    })
  );

  protected controlButtons$ = combineLatest([
    this.options$,
    this.triggerInputValue$,
  ]).pipe(map(([options, query]) => ({ options, showButtons: !!query })));

  @subscribe()
  protected scrollEvent = defer(() =>
    fromEvent(this as EventTarget, 'containerScroll')
  ).pipe(
    catchError(() => of(null)),
    filter((v) => v !== null),
    debounce(() => timer(20)),
    tap(() => {
      this.scrollingAreaController.setScrollAttributes(
        this.scrollContainerRef.value as HTMLElement
      );
    })
  );

  @property({ type: String }) query = '';
  @property({ type: Boolean, reflect: true })
  protected stretched = false;

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

  protected applyInputTexts(options: SearchBoxOptions): void {
    const { placeholder } = options;

    if (placeholder) {
      this.inputRef?.value?.setAttribute('placeholder', placeholder);
    }
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

  protected renderSuggestion(
    suggestion: Suggestion | null,
    options: SearchBoxOptions
  ): TemplateResult {
    if (!suggestion) {
      return html``;
    }

    if (this.isNothingFound(suggestion)) {
      return this.renderSuggestionController.renderNothingFound(options);
    }

    return html`
      <div slot="option">
        <div
          @scroll=${this.dispatchContainerScroll}
          ${ref(this.scrollContainerRef)}
        >
          ${when(this.hasLinks(suggestion), () =>
            this.renderSuggestionController.renderLinksSection(
              suggestion,
              options
            )
          )}
          ${when(this.hasProducts(suggestion), () =>
            this.renderSuggestionController.renderProductsSection(
              suggestion,
              options
            )
          )}
        </div>
      </div>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-typeahead @oryx.typeahead=${this.onTypeahead}>
        <oryx-icon slot="prefix" type="search" size="medium"></oryx-icon>
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
