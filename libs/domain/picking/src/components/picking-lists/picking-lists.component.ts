import { resolve } from '@spryker-oryx/di';
import { PickingListStatus } from '@spryker-oryx/picking';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { Size } from '@spryker-oryx/ui';
import { ButtonType } from '@spryker-oryx/ui/button';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { switchMap } from 'rxjs';
import { PickingListService } from '../../services';
import { styles } from './picking-lists.styles';

export class PickingListsComponent extends LitElement {
  static styles = styles;
  protected pickingListService = resolve(PickingListService);

  @state()
  protected customerNote?: string;

  protected pickingLists$ = this.pickingListService
    .setQualifier({
      status: PickingListStatus.ReadyForPicking,
    })
    .pipe(switchMap(() => this.pickingListService.get()));

  @asyncState()
  protected pickingLists = valueType(this.pickingLists$);

  protected override render(): TemplateResult {
    return html` ${this.renderPickingLists()} ${this.renderCustomerNote()} `;
  }

  protected renderPickingLists(): TemplateResult {
    if (!this.pickingLists?.length) {
      return this.renderEmptyLists();
    }

    return html`${repeat(
      this.pickingLists!,
      (pl) => pl.id,
      (pl) =>
        html`<oryx-picking-list-item
          .pickingListId=${pl.id}
          @oryx.show-note=${this.openCustomerNoteModal}
        ></oryx-picking-list-item>`
    )}`;
  }

  protected renderCustomerNote(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.customerNote}
        enableFooter
        @oryx.close=${this.closeCustomerNoteModal}
      >
        <oryx-heading slot="heading">
          <h2>${i18n('picking.customer-note.heading')}</h2>
        </oryx-heading/>
        ${this.customerNote}
        <oryx-button
          slot="footer"
          type=${ButtonType.Primary}
          size=${Size.Md}
        >
          <button @click=${this.closeCustomerNoteModal}>
            <oryx-icon type=${IconTypes.CheckMark}></oryx-icon>
            ${i18n('picking.customer-note.close')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }

  protected renderEmptyLists(): TemplateResult {
    return html`<p>${i18n('picking.no-picking-lists-found')}</p>`;
  }

  protected openCustomerNoteModal(event: CustomEvent): void {
    this.customerNote = event.detail.note;
  }

  protected closeCustomerNoteModal(): void {
    this.customerNote = undefined;
  }
}
