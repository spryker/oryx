import { resolve } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { Size } from '@spryker-oryx/ui';
import { ButtonType } from '@spryker-oryx/ui/button';
import {
  asyncState,
  i18n,
  isDefined,
  observe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { styles } from './picking-list-item.styles';

export class PickingListItemComponent extends LitElement {
  static styles = styles;

  protected pickingListService = resolve(PickingListService);

  @property() pickingListId?: string;

  @observe()
  protected pickingListId$ = new BehaviorSubject(this.pickingListId);

  @state() isDisabled?: boolean;

  protected pickingList$ = this.pickingListId$
    .pipe(distinctUntilChanged())
    .pipe(
      filter(isDefined),
      switchMap((pickingListId) =>
        this.pickingListService.getById(pickingListId)
      )
    );

  @asyncState()
  pickingList = valueType(this.pickingList$);

  protected startPicking(): void {
    this.isDisabled = true;
    // TODO: push to customer note page if this.pickingList?.cartNote exists
    // else
    // this.pickingListService.startPicking(this.pickingList$!);
    // TODO: push to picking-items page

    this.isDisabled = false;
  }

  protected showCustomerNote(): void {
    if (!this.pickingList?.cartNote) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('oryx.show-note', {
        detail: {
          note: this.pickingList?.cartNote,
        },
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-card>
        <div slot="heading">
          ${when(
            this.pickingList?.createdAt,
            () => html`
              <div class="time">
                ${this.formatTime(this.pickingList!.createdAt!)}
              </div>
            `
          )}
          <div class="identifier">${this.pickingList?.id}</div>
        </div>

        <div class="total">
          <oryx-icon type=${IconTypes.Cart}></oryx-icon>
          <span
            >${i18n('picking.picking-list-item.{count}-items', {
              count: this.pickingList?.items?.length,
            })}</span
          >
        </div>

        ${when(
          this.pickingList?.cartNote,
          () => html`
            <oryx-icon-button size=${Size.Sm}>
              <button
                aria-label="Show customer note"
                @click=${this.showCustomerNote}
              >
                <oryx-icon type=${IconTypes.Info}></oryx-icon>
              </button>
            </oryx-icon-button>
          `
        )}

        <oryx-button
          slot="footer"
          type=${ButtonType.Primary}
          size=${Size.Lg}
          @click=${this.startPicking}
        >
          <button :disabled=${this.isDisabled}>
            ${i18n('picking.picking-list-item.start-picking')}
          </button>
        </oryx-button>
      </oryx-card>
    `;
  }

  protected formatTime(time: Date): string {
    return time
      .toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
  }
}
