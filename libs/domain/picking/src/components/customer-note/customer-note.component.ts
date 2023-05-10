import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { ButtonType } from '@spryker-oryx/ui/button';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { catchError, of, tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import { styles } from './customer-note.styles';

export class CustomerNoteComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  @state()
  protected pickingInProgress?: boolean;

  protected routerService = resolve(RouterService);

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
            this.pickingInProgress = true;
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
      ${this.renderPickingInProgressModal()}
    `;
  }

  protected renderPickingInProgressModal(): TemplateResult {
    return html`<oryx-modal
      ?open=${this.pickingInProgress}
      enableFooter
      footerButtonFullWidth
      @oryx.close=${this.closePickingInProgressModal}
    >
      <oryx-heading slot="heading">
        ${i18n('picking.list.picking-in-progress')}
      </oryx-heading>
      ${i18n('picking.list.already-in-progress')}
      <oryx-button slot="footer" type=${ButtonType.Primary} size=${Size.Md}>
        <button @click=${this.closePickingInProgressModal}>
          ${i18n('picking.list.back-to-pick-lists')}
        </button>
      </oryx-button>
    </oryx-modal>`;
  }

  protected closePickingInProgressModal(): void {
    this.pickingInProgress = false;
  }
}
