import { resolve } from '@spryker-oryx/di';
import { PickingListMixin } from '@spryker-oryx/picking';
import { PickingInProgressModalComponent } from '@spryker-oryx/picking/picking-in-progress';
import { RouterService } from '@spryker-oryx/router';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import { catchError, of, tap } from 'rxjs';
import { customerNoteComponentStyles } from './customer-note.styles';

export class PickingCustomerNoteComponent extends I18nMixin(
  PickingListMixin(LitElement)
) {
  static styles = customerNoteComponentStyles;

  protected routerService = resolve(RouterService);

  @query('oryx-picking-in-progress-modal')
  protected pickingInProgressModal!: PickingInProgressModalComponent;

  protected onProceed(): void {
    //TODO: provide more complex validation
    if (!this.$pickingList()) {
      return;
    }

    this.pickingListService
      .startPicking(this.$pickingList())
      .pipe(
        tap(() =>
          this.routerService.navigate(
            `/picking-list/picking/${this.$pickingList().id}`
          )
        ),
        catchError((e) => {
          if (e.status === 409) {
            this.pickingInProgressModal.open = true;
          }
          return of(undefined);
        })
      )
      .subscribe();
  }

  protected override render(): TemplateResult {
    return html`
      <section>
        <oryx-button
          .type=${ButtonType.Text}
          .size=${ButtonSize.Md}
          .color=${ButtonColor.Neutral}
          .icon=${IconTypes.ArrowBackward}
          .text=${this.i18n('picking.button.back')}
          href="/"
        ></oryx-button>
        <oryx-image resource="user-note"></oryx-image>
        ${this.__renderHeading()}
      </section>

      <p>${this.$pickingList()?.cartNote}</p>

      <oryx-button
        ?loading=${this.$upcomingPickingListId()}
        .text=${this.i18n('picking.proceed-to-picking')}
        @click=${this.onProceed}
      ></oryx-button>

      <oryx-picking-in-progress-modal
        @oryx.back=${this.closePickingInProgressModal}
      ></oryx-picking-in-progress-modal>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    const text = this.i18n('picking.customer-note');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading
        .tag=${HeadingTag.H4}
        .typography=${HeadingTag.H2}
        .md=${HeadingTag.H4}
      >
        ${text}
      </oryx-heading>`;
    } else {
      return html`<oryx-heading
        .typography=${HeadingTag.H2}
        .md=${HeadingTag.H4}
      >
        <h4>${text}</h4>
      </oryx-heading>`;
    }
  }

  protected closePickingInProgressModal(): void {
    this.routerService.navigate('/');
  }
}
