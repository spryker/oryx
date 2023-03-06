import { resolve } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import type { PickingList } from '../../models';
import { styles } from './picking-list-card.styles';

export class PickingListCardComponent extends LitElement {
  static styles = styles;

  protected pickingListService = resolve(PickingListService);

  @property() pickingList?: PickingList;
  @state() isDisabled?: boolean;

  protected startPicking(): void {
    this.isDisabled = true;
    // TODO: push to customer note page if this.pickingList?.cartNote exists
    // else
    this.pickingListService.startPicking(this.pickingList!);
    // TODO: push to picking-items page

    this.isDisabled = false;
  }

  protected showCustomerNote(): void {
    this.dispatchEvent(
      new CustomEvent('showCustomerNote', {
        detail: {
          customerNote: this.pickingList?.cartNote,
        },
      })
    );
  }

  protected override render = (): TemplateResult => {
    return html`
      <oryx-card>
        <div slot="heading" class="time">
          ${this.formatTime(this.pickingList?.createdAt)}
        </div>
        <div slot="heading" class="identifier">${this.pickingList?.id}</div>

        <div class="total">
          <oryx-icon type="cart"></oryx-icon>
          <span :data-e2e="order-total-label-${this.pickingList?.id}"
            >${this.pickingList?.items?.length} items</span
          >
        </div>

        ${when(
          this.pickingList?.cartNote,
          () => html`
              <oryx-icon-button size="large"
                <button
                  :data-e2e="order-note-button-${this.pickingList?.id}"
                  @click=${this.showCustomerNote}
                >
                  <oryx-icon type="info"></oryx-icon>
                </button>
              </oryx-icon-button>
            `
        )}

        <oryx-button
          slot="footer"
          type="primary"
          size="large"
          @click=${this.startPicking}
        >
          <button
            :disabled=${this.isDisabled}
            :data-e2e="start-picking-button-${this.pickingList?.id}"
          >
            Start picking
          </button>
        </oryx-button>
      </oryx-card>
    `;
  };

  protected formatTime(time?: Date): string {
    if (!time) {
      return 'invalid time';
    }

    return time
      .toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
  }
}
