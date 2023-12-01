import { AppRef } from '@spryker-oryx/core';
import { INJECTOR, resolve } from '@spryker-oryx/di';
import { OfflineDataPlugin } from '@spryker-oryx/picking/offline';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking/services';
import { RouterService } from '@spryker-oryx/router';
import { ButtonSize } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  featureVersion,
  i18n,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
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
        ${this.__renderFallbackHeading()}

        <oryx-image resource="no-orders"></oryx-image>
      </div>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderFallbackHeading(): TemplateResult {
    const text = html`<h1>
      ${i18n('picking.location.unassigned')}. ${i18n('picking.location.help')}
      <h1></h1>
    </h1>`;
    if (featureVersion >= '1.4') {
      return html`${text}`;
    } else {
      return html`<oryx-heading as="h2"> ${text} </oryx-heading>`;
    }
  }

  protected renderList(): TemplateResult {
    return html`
      <div class="warehouses-list">
        ${this.__renderListHeading()}
        ${repeat(
          this.$locations() || [],
          (item) => item.id,
          (item) => html`
            ${this.__renderListItemHeading(item.warehouse.name)}
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

  // temporary implementation for backwards compatibility
  private __renderListHeading(): TemplateResult {
    const text = i18n('picking.location.select');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading
        .tag=${HeadingTag.H1}
        .typography=${HeadingTag.H4}
      >
        ${text}
      </oryx-heading>`;
    } else {
      return html` <oryx-heading as="h4">
        <h1>${text}</h1>
      </oryx-heading>`;
    }
  }

  // temporary implementation for backwards compatibility
  private __renderListItemHeading(text: string): TemplateResult {
    if (featureVersion >= '1.4') {
      return html`<h3>${text}</h3>`;
    } else {
      return html`<oryx-heading>
        <h3>${text}</h3>
      </oryx-heading>`;
    }
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
