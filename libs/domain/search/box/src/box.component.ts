import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { Suggestion, SuggestionService } from '@spryker-oryx/search';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { ClearIconPosition } from '@spryker-oryx/ui/searchbox';
import '@spryker-oryx/ui/typeahead';
import {
  asyncState,
  hydratable,
  subscribe,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import {
  catchError,
  debounce,
  defer,
  filter,
  fromEvent,
  map,
  of,
  startWith,
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

@defaultOptions({
  minChars: 2,
  completionsCount: 5,
  productsCount: 5,
  categoriesCount: 5,
  cmsCount: 0,
})
@hydratable('focusin')
export class SearchBoxComponent
  extends ContentMixin<SearchBoxOptions>(LitElement)
  implements SearchBoxProperties
{
  static styles = [baseStyles, searchboxStyles];

  protected suggestionService = resolve(SuggestionService);
  protected routerService = resolve(RouterService);
  protected semanticLinkService = resolve(SemanticLinkService);

  protected scrollingAreaController = new ScrollingAreaController(this);
  protected queryControlsController = new QueryControlsController();
  protected renderSuggestionController = new RenderSuggestionController(this);

  protected triggerInputValue$ = new Subject<string>();

  protected suggestion$ = this.triggerInputValue$.pipe(
    startWith(''),
    // debounce(() => timer(300)),
    // map((q) => q.trim()),
    // distinctUntilChanged(),
    withLatestFrom(this.options$),
    switchMap(([query, options]) => {
      if (query && (!options.minChars || query.length >= options.minChars)) {
        return this.suggestionService.get({ query }).pipe(
          map((raw) =>
            raw
              ? {
                  completion: raw.completion.slice(0, options.completionsCount),
                  products: raw.products?.slice(0, options.productsCount) ?? [],
                  categories: raw.categories.slice(0, options.categoriesCount),
                  cmsPages: raw.cmsPages.slice(0, options.cmsCount),
                }
              : null
          )
        );
      }

      return of(null);
    }),
    tap((suggestion) => {
      this.stretched = this.hasCompleteData(suggestion);
    })
  );

  @asyncState()
  protected suggestion = valueType(this.suggestion$);

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

    this.addEventListener('oryx.clear', this.onClear);
    this.addEventListener('oryx.close', this.onClose);
  }

  disconnectedCallback(): void {
    this.removeEventListener('oryx.clear', this.onClear);
    this.removeEventListener('oryx.close', this.onClose);

    super.disconnectedCallback();
  }

  constructor() {
    super();

    this.onClear = this.onClear.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  protected inputRef: Ref<HTMLInputElement> = createRef();
  protected scrollContainerRef: Ref<HTMLElement> = createRef();

  protected onClear(e: Event): void {
    e.stopPropagation();
    const input = this.inputRef.value as HTMLInputElement;

    input.value = '';
    this.query = '';
    this.triggerInputValue$.next('');
  }

  protected onClose(): void {
    this.renderRoot.querySelector('oryx-typeahead')?.removeAttribute('open');
  }

  protected onTypeahead(): void {
    this.query = (this.inputRef.value as HTMLInputElement).value;
    this.triggerInputValue$.next(this.query);
  }

  protected onScroll(e: Event): void {
    e.target?.dispatchEvent(
      new CustomEvent('containerScroll', { bubbles: true, composed: true })
    );
  }

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

    this.semanticLinkService
      .get({
        type: SemanticLinkType.ProductList,
        ...(this.query ? { params: { q: this.query } } : {}),
      })
      .pipe(
        tap((link) => {
          this.routerService.navigate(link!);
          this.onClose();
        })
      )
      .subscribe();
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

  protected renderSuggestion(suggestion?: Suggestion | null): TemplateResult {
    if (!suggestion) {
      return html``;
    }

    if (this.isNothingFound(suggestion)) {
      return this.renderSuggestionController.renderNothingFound();
    }

    return html`
      <div slot="option">
        <div @scroll=${this.onScroll} ${ref(this.scrollContainerRef)}>
          ${when(this.hasLinks(suggestion), () =>
            this.renderSuggestionController.renderLinksSection(suggestion)
          )}
          ${when(this.hasProducts(suggestion), () =>
            this.renderSuggestionController.renderProductsSection(suggestion)
          )}
        </div>
      </div>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      <form @submit=${this.onSubmit}>
        <oryx-typeahead
          @oryx.typeahead=${this.onTypeahead}
          .clearIconPosition=${ClearIconPosition.NONE}
        >
          <oryx-icon slot="prefix" type="search" size="medium"></oryx-icon>
          <input ${ref(this.inputRef)} placeholder="Search" />
          ${this.renderSuggestion(this.suggestion)}
          ${when(this.query, () =>
            this.queryControlsController.renderControls()
          )}
        </oryx-typeahead>
      </form>
    `;
  }
}
