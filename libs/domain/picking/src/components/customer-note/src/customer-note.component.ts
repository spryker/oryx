import { resolve } from '@spryker-oryx/di';
import { PickingListMixin } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { catchError, of, tap } from 'rxjs';
import { styles } from './customer-note.styles';

export class CustomerNoteComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  @state()
  protected startPickingLoading?: boolean;

  protected onProceed(): void {
    //TODO: provide more complex validation
    if (!this.pickingList) {
      return;
    }

    this.startPickingLoading = true;

    this.pickingListService
      .startPicking(this.pickingList)
      .pipe(
        tap(() => {
          this.startPickingLoading = false;
          this.routerService.navigate(
            `/picking-list/picking/${this.pickingList.id}`
          );
        }),
        catchError(() => {
          this.startPickingLoading = false;
          return of(null);
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

      <oryx-button ?loading=${this.startPickingLoading}>
        <button @click=${this.onProceed}>
          ${i18n('picking.proceed-to-picking')}
        </button>
      </oryx-button>
    `;
  }
}
