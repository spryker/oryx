import { resolve } from '@spryker-oryx/di';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PickingList, PickingListStatus } from '../../models';
import { PickingListService } from '../../services';

export class PickingListsComponent extends LitElement {
  protected pickingListService = resolve(PickingListService);

  protected pickingLists$ = this.pickingListService.get({
    status: PickingListStatus.ReadyForPicking,
  });

  protected override render(): unknown {
    return html`${asyncValue(
      this.pickingLists$,
      (pickingLists) => this.renderPickingLists(pickingLists),
      () => html`<p>Loading picking lists...</p>`
    )}`;
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
              ></oryx-picking-list-card>`
          )}`,
        () => html`<p>No picking lists found!</p>`
      )}
    `;
  }
}

export default PickingListsComponent;
