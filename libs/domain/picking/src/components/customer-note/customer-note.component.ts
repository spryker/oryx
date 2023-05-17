import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { catchError, of, tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import { PickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.component';
import { styles } from './customer-note.styles';

export class CustomerNoteComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  protected pickingInProgressModal = createRef();

  protected onProceed(): void {
    //TODO: provide more complex validation
    if (!this.pickingList) {
      return;
    }

    this.pickingListService
      .startPicking(this.pickingList)
      .pipe(
        tap(() =>
          this.routerService.navigate(
            `/picking-list/picking/${this.pickingList.id}`
          )
        ),
        catchError((e) => {
          if (e.status === 409) {
            const modal = this.pickingInProgressModal
              .value as PickingInProgressModalComponent;
            modal.open = true;
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
          <h4>${i18n('picking.customer-note')}</h4>
        </oryx-heading>
      </section>

      <p>${this.pickingList?.cartNote}</p>

      <oryx-button ?loading=${this.upcomingPickingListId}>
        <button @click=${this.onProceed}>
          ${i18n('picking.proceed-to-picking')}
        </button>
      </oryx-button>
      <oryx-picking-in-progress-modal
        @oryx.close=${this.closePickingInProgressModal}
        ${ref(this.pickingInProgressModal)}
      ></oryx-picking-in-progress-modal>
    `;
  }

  protected closePickingInProgressModal(): void {
    this.routerService.navigate('/');
  }
}
