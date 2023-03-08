import { resolve } from '@spryker-oryx/di';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PickingList, PickingListStatus } from '../../models';
import { PickingListService } from '../../services';
import { styles } from './picking-lists.styles';

export class PickingListsComponent extends LitElement {
  static styles = styles;

  @state() customerNote?: string;

  protected pickingListService = resolve(PickingListService);

  protected pickingLists$ = this.pickingListService.get({
    status: PickingListStatus.ReadyForPicking,
  });

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.pickingLists$,
        (pickingLists) => this.renderPickingLists(pickingLists),
        () => html`<p>Loading picking lists...</p>`
      )}

      <oryx-customer-note-modal
        customerNote=${ifDefined(this.customerNote)}
        @close=${this.closeCustomerNoteModal}
      ></oryx-customer-note-modal>
    `;
  }

  protected renderPickingLists(pickingLists: PickingList[]): TemplateResult {
    return html`
      ${when(
        pickingLists.length,
        () =>
          html`${repeat(
            pickingLists,
            (pl) => pl.id,
            (pl) =>
              html`<oryx-picking-list-card
                .pickingList=${pl}
                @showCustomerNote=${this.openCustomerNoteModal}
              ></oryx-picking-list-card>`
          )}`,
        this.renderFallback
      )}
    `;
  }

  protected renderFallback(): TemplateResult {
    return html`<p>No picking lists found!</p>`;
  }

  protected openCustomerNoteModal(event: CustomEvent): void {
    this.customerNote = event.detail.customerNote;
  }

  protected closeCustomerNoteModal(): void {
    this.customerNote = undefined;
  }
}
