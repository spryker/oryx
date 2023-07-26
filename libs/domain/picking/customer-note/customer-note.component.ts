import { resolve } from '@spryker-oryx/di';
import { PickingListMixin } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { catchError, of, tap } from 'rxjs';
import { PickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.component';
import { customerNoteComponentStyles } from './customer-note.styles';

export class CustomerNoteComponent extends I18nMixin(
  PickingListMixin(LitElement)
) {
  static styles = customerNoteComponentStyles;

  protected routerService = resolve(RouterService);

  protected pickingInProgressModal =
    createRef<PickingInProgressModalComponent>();

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
            const modal = this.pickingInProgressModal.value;
            modal && (modal.open = true);
          }
          return of(undefined);
        })
      )
      .subscribe();
  }

  protected override render(): TemplateResult {
    return html`
      <section>
        <oryx-navigate-back></oryx-navigate-back>
        <oryx-image resource="user-note"></oryx-image>
        <oryx-heading as="h2" as-md="h4">
          <h4>${this.i18n('picking.customer-note')}</h4>
        </oryx-heading>
      </section>

      <p>${this.$pickingList()?.cartNote}</p>

      <oryx-button ?loading=${this.$upcomingPickingListId()}>
        <button @click=${this.onProceed}>
          ${this.i18n('picking.proceed-to-picking')}
        </button>
      </oryx-button>
      <oryx-picking-in-progress-modal
        @oryx.back=${this.closePickingInProgressModal}
        ${ref(this.pickingInProgressModal)}
      ></oryx-picking-in-progress-modal>
    `;
  }

  protected closePickingInProgressModal(): void {
    this.routerService.navigate('/');
  }
}
