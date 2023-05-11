import { resolve } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { ButtonType } from '@spryker-oryx/ui/button';
import { asyncState, i18n, Size, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PickingListStatus } from '../../models';
import { PickingListService } from '../../services';
import { PickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.component';
import { styles } from './picking-lists.styles';

export class PickingListsComponent extends LitElement {
  static styles = styles;
  protected pickingListService = resolve(PickingListService);

  @state()
  protected customerNote?: string;

  protected pickingInProgressModal = createRef();

  protected pickingLists$ = this.pickingListService.get({
    status: PickingListStatus.ReadyForPicking,
  });

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
      <oryx-picking-lists-header></oryx-picking-lists-header>

      ${when(
        !this.pickingLists?.length,
        () => this.renderEmptyLists(),
        () => html`<section>
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
        </section>`
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
        </oryx-heading/>
        ${this.customerNote}
        <oryx-button
          slot="footer"
          type=${ButtonType.Primary}
          size=${Size.Md}
        >
          <button @click=${this.closeCustomerNoteModal}>
            <oryx-icon type=${IconTypes.CheckMark}></oryx-icon>
            ${i18n('picking-lists.customer-note.got-it')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }

  protected renderEmptyLists(): TemplateResult {
    return html`
      <div class="no-items-fallback">
        <oryx-heading as="h4">
          ${i18n('picking-lists.no-results-found')}
        </oryx-heading>
        <oryx-image resource="no-orders"></oryx-image>
      </div>
    `;
  }

  protected openCustomerNoteModal(event: CustomEvent): void {
    this.customerNote = event.detail.note;
  }

  protected closeCustomerNoteModal(): void {
    this.customerNote = undefined;
  }

  protected openPickingInProgressModal(event: CustomEvent): void {
    (
      this.pickingInProgressModal.value as PickingInProgressModalComponent
    )?.open();
  }
}
