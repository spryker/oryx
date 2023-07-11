import { resolve } from '@spryker-oryx/di';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { i18n, signal, signalAware, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { styles } from './warehouse-assignment.styles';

@signalAware()
export class WarehouseAssignmentComponent extends LitElement {
  static styles = styles;

  protected warehouseUserAssignmentsService = resolve(
    WarehouseUserAssignmentsService
  );

  protected routerService = resolve(RouterService);

  protected $locations = signal(
    this.warehouseUserAssignmentsService.getList(),
    { initialValue: null }
  );

  protected override render(): TemplateResult {
    return html`
      <oryx-picking-header></oryx-picking-header>
      ${when(
        this.$locations() === null,
        () => this.renderLoading(),
        () =>
          html`${when(
            this.$locations()?.length,
            () => this.renderList(),
            () => this.renderFallback()
          )}`
      )}
    `;
  }

  protected onSelect(assignmentId: string): void {
    this.warehouseUserAssignmentsService
      .activateAssignment(assignmentId)
      .pipe(
        tap(() => {
          this.routerService.navigate('/');
        })
      )
      .subscribe();
  }

  protected renderFallback(): TemplateResult {
    return html`
      <div class="fallback">
        <oryx-heading as="h2">
          <h1>
            ${i18n('picking.you-are-not-assigned-to-any-locations')}.
            ${i18n('picking.please-reach-out-to-your-manager')}
          </h1>
        </oryx-heading>

        <oryx-image resource="no-orders"></oryx-image>
      </div>
    `;
  }

  protected renderList(): TemplateResult {
    return html`
      <div class="warehouses-list">
        <oryx-heading as="h4">
          <h1>${i18n('picking.select-your-location-to-get-started')}</h1>
        </oryx-heading>
        ${repeat(
          this.$locations() || [],
          (item) => item.id,
          (item) => html`
            <oryx-heading>
              <h3>${item.warehouse.name}</h3>
            </oryx-heading>

            <oryx-button size=${Size.Sm}>
              <button @click=${() => this.onSelect(item.id)}>
                ${i18n('picking.select')}
              </button>
            </oryx-button>
            <hr />
          `
        )}
      </div>
    `;
  }

  protected renderLoading(): TemplateResult {
    return html`
      <div class="loading">
        <span>${i18n('picking.loading-locations')}</span>
        <oryx-spinner></oryx-spinner>
      </div>
    `;
  }
}
