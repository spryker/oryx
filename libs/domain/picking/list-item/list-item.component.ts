import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { PickingListMixin } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { catchError, of, tap } from 'rxjs';
import { ListItemAttributes } from './list-item.model';
import { pickingListItemComponentStyles } from './list-item.styles';

export class ListItemComponent
  extends I18nMixin(PickingListMixin(LitElement))
  implements ListItemAttributes
{
  static styles = pickingListItemComponentStyles;

  protected routerService = resolve(RouterService);
  protected localeService = resolve(LocaleService);

  protected $requestedDeliveryDate = computed(() => {
    if (!isNaN(this.$pickingList()?.requestedDeliveryDate.getTime())) {
      return this.localeService.formatTime(
        this.$pickingList()?.requestedDeliveryDate
      );
    }
    return '';
  });

  protected startPicking(): void {
    if (this.$pickingList()?.cartNote) {
      this.routerService.navigate(
        `/customer-note-info/${this.$pickingList().id}`
      );
      return;
    }

    this.pickingListService
      .startPicking(this.$pickingList())
      .pipe(
        tap(() => {
          this.routerService.navigate(
            `/picking-list/picking/${this.$pickingList().id}`
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
          note: this.$pickingList().cartNote,
        },
      })
    );
  }

  protected override render(): TemplateResult | void {
    if (!this.$pickingList()) return;

    return html`
      <oryx-card>
        ${when(
          this.$pickingList()?.createdAt,
          () => html` <h3 slot="heading">${this.$requestedDeliveryDate()}</h3> `
        )}
        <span slot="heading" class="identifier"
          >${this.$pickingList().orderReferences[0]}</span
        >

        <div class="total">
          <oryx-icon .type=${IconTypes.Cart}></oryx-icon>
          ${this.i18n('picking.list-item.<count>-items', {
            count: this.$pickingList()?.itemsCount,
          })}
          ${when(
            this.$pickingList()?.cartNote,
            () => html`
              <oryx-button
                class="show-customer"
                .type=${ButtonType.Icon}
                .color=${ButtonColor.Primary}
                .size=${ButtonSize.Md}
                .icon=${IconTypes.Info}
                .label=${this.i18n('picking.list-item.show-customer-note')}
                @click=${this.showCustomerNote}
              ></oryx-button>
            `
          )}
        </div>

        <oryx-button
          slot="footer"
          class="start-picking"
          .color=${ButtonColor.Primary}
          .size=${ButtonSize.Lg}
          .text=${this.i18n('picking.list-item.start-picking')}
          ?loading=${this.$upcomingPickingListId() === this.$pickingList().id}
          ?disabled=${this.$upcomingPickingListId() &&
          this.$upcomingPickingListId() !== this.$pickingList().id}
          @click=${this.startPicking}
        ></oryx-button>
      </oryx-card>
    `;
  }
}
