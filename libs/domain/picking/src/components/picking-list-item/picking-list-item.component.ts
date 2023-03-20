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
import { formatTime } from '../../utilities';
import { PickingListItemProps } from './picking-list-item.model';
import { styles } from './picking-list-item.styles';

export class PickingListItemComponent
  extends LitElement
  implements PickingListItemProps
{
  static styles = styles;

  protected pickingListService = resolve(PickingListService);

  @property() pickingListId?: string;

  @observe()
  protected pickingListId$ = new BehaviorSubject(this.pickingListId);

  // TODO: refactor this variable when start picking logic will be implemented (loading state should be the service area of responsibility)
  @state()
  protected isDisabled?: boolean;

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
    // TODO: implement start piking logic

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

  protected override render(): TemplateResult | undefined {
    if (!this.pickingList) return;

    return html`
      <oryx-card>
        <oryx-heading slot="heading">
          ${when(
            this.pickingList.createdAt,
            () => html` <h2>${formatTime(this.pickingList!.createdAt)}</h2> `
          )}
          <h4 class="identifier">${this.pickingList.id}</h4>
        </oryx-heading>

        <div class="total">
          <oryx-icon type=${IconTypes.Cart}></oryx-icon>
          <span
            >${i18n('picking.picking-list-item.{count}-items', {
              count: this.pickingList.items.length,
            })}</span
          >
        </div>

        ${when(
          this.pickingList.cartNote,
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

        <oryx-button slot="footer" type=${ButtonType.Primary} size=${Size.Lg}>
          <button ?disabled=${this.isDisabled} @click=${this.startPicking}>
            ${i18n('picking.picking-list-item.start-picking')}
          </button>
        </oryx-button>
      </oryx-card>
    `;
  }
}
