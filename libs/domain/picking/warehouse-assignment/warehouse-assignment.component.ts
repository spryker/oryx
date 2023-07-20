import { AppRef } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { RouterService } from '@spryker-oryx/router';
import { ButtonSize } from '@spryker-oryx/ui/button';
import { i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { switchMap } from 'rxjs';
import { styles } from './warehouse-assignment.styles';

@signalAware()
export class WarehouseAssignmentComponent extends LitElement {
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
      <oryx-header></oryx-header>
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
        switchMap(() => {
          this.routerService.navigate('/');
          return this.injectorDataPlugin.refreshData(this.injector);
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

            <oryx-button
              .size=${ButtonSize.Sm}
              @click=${() => this.onSelect(item.id)}
            >
              ${i18n('picking.select')}
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
