import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { PickingList } from '../../models';

export class PickingListCardComponent extends LitElement {
  @property() pickingList?: PickingList;

  protected override render(): unknown {
    return html`<p>
      PickingList ${this.pickingList?.id} in status ${this.pickingList?.status}
      with ${this.pickingList?.items.length} item(s)
    </p>`;
  }
}

export default PickingListCardComponent;
