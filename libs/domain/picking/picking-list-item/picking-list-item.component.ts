import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { PickingListMixin } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { asyncValue, I18nMixin, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { catchError, of, tap } from 'rxjs';
import { PickingListItemAttributes } from './picking-list-item.model';
import { pickingListItemComponentStyles } from './picking-list-item.styles';

export class PickingListItemComponent
  extends I18nMixin(PickingListMixin(LitElement))
  implements PickingListItemAttributes
{
  static styles = pickingListItemComponentStyles;

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
        }),
        catchError((e) => {
          if (e.status === 409) {
            this.dispatchEvent(
              new CustomEvent('oryx.show-picking-in-progress')
            );
          }
          return of(undefined);
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
        ${when(
          this.pickingList?.createdAt,
          () =>
            html`
              <h3 slot="heading">
                ${!isNaN(this.pickingList.requestedDeliveryDate.getTime())
                  ? asyncValue(
                      this.localeService.formatTime(
                        this.pickingList.requestedDeliveryDate
                      )
                    )
                  : ''}
              </h3>
            `
        )}
        <span slot="heading" class="identifier"
          >${this.pickingList.orderReferences[0]}</span
        >

        <div class="total">
          <oryx-icon .type=${IconTypes.Cart}></oryx-icon>
          ${this.i18n('picking.picking-list-item.<count>-items', {
            count: this.pickingList?.itemsCount,
          })}
          ${when(
            this.pickingList?.cartNote,
            () => html`
              <oryx-icon-button
                .size=${ButtonSize.Md}
                aria-label="Show customer note"
                @click=${this.showCustomerNote}
              >
                <oryx-icon .type=${IconTypes.Info}></oryx-icon>
              </oryx-icon-button>
            `
          )}
        </div>

        <oryx-button
          slot="footer"
          .color=${ButtonColor.Primary}
          .size=${ButtonSize.Lg}
          ?loading=${this.upcomingPickingListId === this.pickingList.id}
          ?disabled=${this.upcomingPickingListId &&
          this.upcomingPickingListId !== this.pickingList.id}
          @click=${this.startPicking}
        >
          ${this.i18n('picking.picking-list-item.start-picking')}
        </oryx-button>
      </oryx-card>
    `;
  }
}
