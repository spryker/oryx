import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { PickingListMixin } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { Size } from '@spryker-oryx/ui';
import { ButtonType } from '@spryker-oryx/ui/button';
import { asyncValue, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { PickingListItemAttributes } from './picking-list-item.model';
import { styles } from './picking-list-item.styles';

export class PickingListItemComponent
  extends PickingListMixin(LitElement)
  implements PickingListItemAttributes
{
  static styles = styles;

  protected routerService = resolve(RouterService);
  protected localeService = resolve(LocaleService);

  protected startPicking(): void {
    if (this.pickingList?.cartNote) {
      this.routerService.navigate(`/customer-note-info/${this.pickingList.id}`);
      return;
    }

    this.pickingListService
      .startPicking(this.pickingList)
      .pipe(
        tap(() => {
          this.routerService.navigate(
            `/picking-list/picking/${this.pickingList.id}`
          );
        })
      )
      .subscribe();
  }

  protected showCustomerNote(): void {
    this.dispatchEvent(
      new CustomEvent('oryx.show-note', {
        detail: {
          note: this.pickingList.cartNote,
        },
      })
    );
  }

  protected override render(): TemplateResult | void {
    if (!this.pickingList) return;

    return html`
      <oryx-card>
        <oryx-heading slot="heading">
          ${when(
            this.pickingList?.createdAt,
            () =>
              html`
                <span
                  >${asyncValue(
                    this.localeService.formatTime(this.pickingList.createdAt)
                  )}</span
                >
              `
          )}
          <h4 class="identifier">${this.pickingList.id}</h4>
        </oryx-heading>

        <div class="total">
          <oryx-icon type=${IconTypes.Cart}></oryx-icon>
          <span
            >${i18n('picking.picking-list-item.<count>-items', {
              count: this.pickingList?.items.length,
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
          ?loading=${this.upcomingPickingListId === this.pickingList.id}
        >
          <button
            ?disabled=${this.upcomingPickingListId &&
            this.upcomingPickingListId !== this.pickingList.id}
            @click=${this.startPicking}
          >
            ${i18n('picking.picking-list-item.start-picking')}
          </button>
        </oryx-button>
      </oryx-card>
    `;
  }
}
