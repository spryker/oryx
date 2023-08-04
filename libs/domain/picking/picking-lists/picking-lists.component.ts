import { AppRef } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import {
  FallbackType,
  PickingListService,
  PickingListStatus,
} from '@spryker-oryx/picking';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { I18nMixin, i18n, signal, subscribe } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import {
  Subject,
  catchError,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { PickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.component';
import { pickingListsComponentStyles } from './picking-lists.styles';

export class PickingListsComponent extends I18nMixin(LitElement) {
  static styles = pickingListsComponentStyles;
  protected pickingListService = resolve(PickingListService);

  @state()
  protected isSearchActive = false;

  @state()
  protected customerNote?: string;

  protected pickingInProgressModal =
    createRef<PickingInProgressModalComponent>();

  @state()
  protected searchValueLength?: number = 0;

  @state()
  protected loading = true;

  protected searchValue$ = new Subject<string>();

  protected injector = resolve(INJECTOR);
  protected injectorDataPlugin =
    resolve(AppRef).requirePlugin(OfflineDataPlugin);

  @subscribe()
  protected dataRefresh = this.injectorDataPlugin
    .refreshData(this.injector)
    .pipe(
      catchError((value) => {
        return of(value);
      }),
      tap({
        subscribe: () => {
          this.loading = true;
        },
        finalize: () => {
          this.loading = false;
        },
      })
    );

  protected pickingLists$ = this.searchValue$.pipe(
    startWith(''),
    map((q) => q.trim()),
    distinctUntilChanged(),
    switchMap((value) => {
      this.searchValueLength = value.length;

      return this.pickingListService.get({
        status: PickingListStatus.ReadyForPicking,
        searchOrderReference: value,
      });
    })
  );

  protected $pickingLists = signal(this.pickingLists$);

  protected override render(): TemplateResult {
    return html` ${this.renderLoading()}${this.renderPickingLists()}
      <oryx-picking-in-progress-modal
        ${ref(this.pickingInProgressModal)}
      ></oryx-picking-in-progress-modal>

      <oryx-customer-note-modal
        ?open=${!!this.customerNote}
        @oryx.close=${this.closeCustomerNoteModal}
      >
        ${this.customerNote}
      </oryx-customer-note-modal>`;
  }

  protected renderLoading(): TemplateResult {
    return html`${when(
      this.loading,
      () => html`<div class="loading">
        <span>${i18n('picking.loading-locations')}</span>
        <oryx-spinner></oryx-spinner>
      </div>`
    )}`;
  }

  protected renderPickingLists(): TemplateResult {
    return html`
      <oryx-picking-lists-header
        @oryx.search=${this.searchOrderReference}
      ></oryx-picking-lists-header>

      ${this.renderFilters()}
      ${when(
        !this.$pickingLists()?.length,
        () => this.renderResultsFallback(),
        () => html`
          ${when(
            this.noValueSearchProvided(),
            () => this.renderSearchFallback(),
            () => html`
              <section>
                ${when(
                  this.isSearchActive,
                  () => html`
                    <oryx-heading slot="heading">
                      <h4>
                        ${this.i18n('picking-lists.search-results-for-picking')}
                      </h4>
                    </oryx-heading>
                  `
                )}
                ${repeat(
                  this.$pickingLists(),
                  (pl) => pl.id,
                  (pl) =>
                    html`<oryx-picking-list-item
                      .pickingListId=${pl.id}
                      @oryx.show-note=${this.openCustomerNoteModal}
                      @oryx.show-picking-in-progress=${this
                        .openPickingInProgressModal}
                    ></oryx-picking-list-item>`
                )}
              </section>
            `
          )}
        `
      )}
    `;
  }

  protected renderResultsFallback(): TemplateResult {
    const fallbackType = !this.isSearchActive
      ? FallbackType.noResults
      : FallbackType.noSearchingResults;

    const fallbackTitle = this.getFallbackTitle(fallbackType);

    return html`
      <div class="no-items-fallback">
        <oryx-heading as="h4"> ${fallbackTitle} </oryx-heading>
        <oryx-image resource="${fallbackType}"></oryx-image>
      </div>
    `;
  }

  protected renderFilters(): TemplateResult {
    return html` <div class="filters">
      <span>
        ${this.i18n('picking.filter.<count>-open-pick-lists', {
          count: this.$pickingLists()?.length ?? 0,
        })}
      </span>
      <oryx-picking-filter-button></oryx-picking-filter-button>
    </div>`;
  }

  protected renderSearchFallback(): TemplateResult {
    const fallbackTitle = this.getFallbackTitle(FallbackType.noValueProvided);

    return html`
      <div class="no-items-fallback">
        <oryx-heading as="h4"> ${fallbackTitle} </oryx-heading>
        <oryx-image resource="${FallbackType.noValueProvided}"></oryx-image>
      </div>
    `;
  }

  protected searchOrderReference(event: CustomEvent): void {
    this.isSearchActive = event.detail.open;

    this.searchValue$.next(event.detail.search);
  }

  protected openCustomerNoteModal(event: CustomEvent): void {
    this.customerNote = event.detail.note;
  }

  protected closeCustomerNoteModal(): void {
    this.customerNote = undefined;
  }

  protected openPickingInProgressModal(event: CustomEvent): void {
    const modal = this.pickingInProgressModal.value;
    modal && (modal.open = true);
  }

  private noValueSearchProvided(): boolean {
    return this.isSearchActive && !(this.searchValueLength! >= 2);
  }

  private getFallbackTitle(fallbackType: FallbackType) {
    switch (fallbackType) {
      case FallbackType.noResults:
        return this.i18n('picking-lists.no-results-found');
      case FallbackType.noSearchingResults:
        return this.i18n('picking-lists.no-picking-results');
      case FallbackType.noValueProvided:
        return this.i18n('picking-lists.search-by-order-ID');
      default:
        return '';
    }
  }
}
