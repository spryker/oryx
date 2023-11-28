import { AppRef } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking/services';
import { RouterService } from '@spryker-oryx/router';
import { ButtonSize } from '@spryker-oryx/ui/button';
import { i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { switchMap } from 'rxjs';
import { styles } from './warehouse-assignment.styles';

@signalAware()
export class PickingWarehouseAssignmentComponent extends LitElement {
  static styles = styles;

  protected warehouseUserAssignmentsService = resolve(
    WarehouseUserAssignmentsService
  );

  protected injector = resolve(INJECTOR);
  protected injectorDataPlugin =
    resolve(AppRef).requirePlugin(OfflineDataPlugin);

  protected routerService = resolve(RouterService);

  protected $locations = signal(
    this.warehouseUserAssignmentsService.getList(),
    { initialValue: null }
  );

  protected override render(): TemplateResult {
    return html`
      ${when(
        this.$locations() === null || this.$locations()?.length === 1,
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

  protected selectWarehouse(assignmentId: string): void {
    this.warehouseUserAssignmentsService
      .activateAssignment(assignmentId)
      .pipe(
        switchMap(() => {
          this.routerService.navigate('/');
          return this.injectorDataPlugin.syncData(this.injector);
        })
      )
      .subscribe();
  }

  protected renderFallback(): TemplateResult {
    return html`
      <div class="fallback">
        <oryx-heading as="h2">
          <h1>
            ${i18n('picking.location.unassigned')}.
            ${i18n('picking.location.help')}
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
          <h1>${i18n('picking.location.select')}</h1>
        </oryx-heading>
        ${repeat(
          this.$locations() || [],
          (item) => item.id,
          (item) => html`
            <oryx-heading>
              <h3>${item.warehouse.name}</h3>
            </oryx-heading>

            <oryx-button
              .size=${ButtonSize.Sm}
              .text=${i18n('select')}
              @click=${() => this.selectWarehouse(item.id)}
            ></oryx-button>
            <hr />
          `
        )}
      </div>
    `;
  }

  protected renderLoading(): TemplateResult {
    const locations = this.$locations();
    if (locations?.length === 1) {
      this.selectWarehouse(locations[0].id);
    }

    return html`
      <div class="loading">
        <span>${i18n('picking.location.loading')}</span>
        <oryx-spinner></oryx-spinner>
      </div>
    `;
  }
}
