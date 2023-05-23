import { resolve } from '@spryker-oryx/di';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { asyncState, i18n, Size, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { distinctUntilChanged, map, startWith, Subject, switchMap } from 'rxjs';
import { FallbackType, PickingListStatus } from '../../models';
import { PickingListService } from '../../services';
import { PickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.component';
import { pickingListsComponentStyles } from './picking-lists.styles';

export class PickingListsComponent extends LitElement {
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

  protected searchValue$ = new Subject<string>();

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

  @asyncState()
  protected pickingLists = valueType(this.pickingLists$);

  protected override render(): TemplateResult {
    return html` ${this.renderPickingLists()} ${this.renderCustomerNote()}
      <oryx-picking-in-progress-modal
        ${ref(this.pickingInProgressModal)}
      ></oryx-picking-in-progress-modal>`;
  }

  protected renderPickingLists(): TemplateResult {
    return html`
      <oryx-picking-lists-header
        @oryx.search=${this.searchOrderReference}
      ></oryx-picking-lists-header>

      ${this.renderSorting()}
      ${when(
        !this.pickingLists?.length,
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
                        ${i18n('picking-lists.search-results-for-picking')}
                      </h4>
                    </oryx-heading>
                  `
                )}
                ${repeat(
                  this.pickingLists!,
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

  protected renderCustomerNote(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.customerNote}
        enableFooter
        footerButtonFullWidth
        @oryx.close=${this.closeCustomerNoteModal}
      >
        <oryx-heading slot="heading">
          <h2>${i18n('picking-lists.customer-note.customer-note')}</h2>
        </oryx-heading>
        ${this.customerNote}
        <oryx-button slot="footer" type=${ButtonType.Primary} size=${Size.Md}>
          <button @click=${this.closeCustomerNoteModal}>
            <oryx-icon type=${IconTypes.Mark}></oryx-icon>
            ${i18n('picking-lists.customer-note.got-it')}
          </button>
        </oryx-button>
      </oryx-modal>
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

  protected renderSorting(): TemplateResult {
    return html` <div class="filters">
      <span>
        ${i18n('picking.filter.<value>-open-orders', {
          value: this.pickingLists?.length ?? 0,
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
        return i18n('picking-lists.no-results-found');
      case FallbackType.noSearchingResults:
        return i18n('picking-lists.no-picking-results');
      case FallbackType.noValueProvided:
        return i18n('picking-lists.search-by-order-ID');
      default:
        return '';
    }
  }
}
