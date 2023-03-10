import { resolve } from '@spryker-oryx/di';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PickingListStatus } from '../../models';
import { PickingListService } from '../../services';
import { styles } from './picking-lists.styles';

export class PickingListsComponent extends LitElement {
  static styles = styles;

  protected pickingListService = resolve(PickingListService);

  protected pickingLists$ = this.pickingListService.get({
    status: PickingListStatus.ReadyForPicking,
  });

  @state()
  protected customerNote?: string;

  @asyncState()
  protected pickingLists = valueType(this.pickingLists$);

  protected override render(): TemplateResult {
    return html` ${this.renderPickingLists()} ${this.renderCustomerNote()} `;
  }

  protected renderPickingLists(): TemplateResult {
    return html`
      ${when(
        this.pickingLists?.length,
        () =>
          html`${repeat(
            this.pickingLists!,
            (pl) => pl.id,
            (pl) =>
              html`<oryx-picking-list-item
                .pickingList=${pl}
                @oryx.show-note=${this.openCustomerNoteModal}
              ></oryx-picking-list-item>`
          )}`,
        this.renderFallback
      )}
    `;
  }

  protected renderCustomerNote(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.customerNote}
        enableFooter
        @oryx.close=${this.closeCustomerNoteModal}
      >
        <span slot="heading">${i18n('picking.customer-note.heading')}</span/>
        ${this.customerNote}
        <oryx-button slot="footer" type="primary" size="small">
          <button @click=${this.closeCustomerNoteModal}>
            <oryx-icon type="checkMark"></oryx-icon>
            ${i18n('picking.customer-note.close')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }

  protected renderFallback(): TemplateResult {
    return html`<p>${i18n('picking.no-picking-lists-found')}</p>`;
  }

  protected openCustomerNoteModal(event: CustomEvent): void {
    this.customerNote = event.detail.note;
  }

  protected closeCustomerNoteModal(): void {
    this.customerNote = undefined;
  }
}
