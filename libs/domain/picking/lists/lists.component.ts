import { AppRef } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { FallbackType } from '@spryker-oryx/picking';
import {
  OfflineDataPlugin,
  PickingSyncActionHandlerService,
} from '@spryker-oryx/picking/offline';
import { PickingInProgressModalComponent } from '@spryker-oryx/picking/picking-in-progress';
import {
  PickingListService,
  PickingListStatus,
} from '@spryker-oryx/picking/services';
import { I18nMixin, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { Subject, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { pickingListsComponentStyles } from './lists.styles';

@signalAware()
export class PickingListsComponent extends I18nMixin(LitElement) {
  static styles = pickingListsComponentStyles;
  protected pickingListService = resolve(PickingListService);
  protected pickingSyncHandler = resolve(PickingSyncActionHandlerService);

  @state()
  protected isSearchActive = false;

  @state()
  protected customerNote?: string;

  protected pickingInProgressModal =
    createRef<PickingInProgressModalComponent>();

  @state()
  protected searchValueLength?: number = 0;

  protected searchValue$ = new Subject<string>();

  protected injectorDataPlugin =
    resolve(AppRef).requirePlugin(OfflineDataPlugin);

  protected $syncing = signal(this.pickingSyncHandler.isSyncing());
  protected $refreshing = signal(this.injectorDataPlugin.isRefreshing());

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
    return html` ${this.renderPickingLists()}
      <oryx-picking-in-progress-modal
        ${ref(this.pickingInProgressModal)}
      ></oryx-picking-in-progress-modal>

      <oryx-picking-customer-note-modal
        ?open=${!!this.customerNote}
        @oryx.close=${this.closeCustomerNoteModal}
      >
        ${this.customerNote}
      </oryx-picking-customer-note-modal>`;
  }

  protected renderPickingLists(): TemplateResult {
    return html` <oryx-picking-lists-header
        @oryx.search=${this.searchOrderReference}
      ></oryx-picking-lists-header>

      ${this.renderFilters()}
      ${when(
        this.$refreshing(),
        () => this.renderLoading(),
        () =>
          html`${when(
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
                            ${this.i18n(
                              'picking-lists.search-results-for-picking'
                            )}
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
          )}`
      )}`;
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
      ${when(
        this.$syncing(),
        () => html`<span class="sync">
          <span>${i18n('picking.loading-data')}</span>
          <oryx-spinner></oryx-spinner>
        </span>`,
        () =>
          html`<span
            >${this.i18n('picking.filter.<count>-open-pick-lists', {
              count: this.$pickingLists()?.length ?? 0,
            })}</span
          >`
      )}
      <oryx-picking-filter-button></oryx-picking-filter-button>
    </div>`;
  }

  protected renderLoading(): TemplateResult {
    return html`<div class="loading">
      <span>${i18n('picking.loading-data')}</span>
      <oryx-spinner></oryx-spinner>
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
        return this.i18n('picking.list.no-results-found');
      case FallbackType.noSearchingResults:
        return this.i18n('picking.list.no-picking-results');
      case FallbackType.noValueProvided:
        return this.i18n('picking.list.search-by-order-ID');
      default:
        return '';
    }
  }
}
