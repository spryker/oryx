import { resolve } from '@spryker-oryx/di';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { asyncState, i18n, Size, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { tap } from 'rxjs';
import { styles } from './warehouse-assignment.styles';

export class WarehouseAssignmentComponent extends LitElement {
  static styles = styles;

  protected warehouseUserAssignmentsService = resolve(
    WarehouseUserAssignmentsService
  );

  protected routerService = resolve(RouterService);

  @asyncState()
  protected locations = valueType(
    this.warehouseUserAssignmentsService.getList()
  );

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

  protected override render(): TemplateResult {
    return html`
      <oryx-heading as="h4">
        <h1>${i18n('picking.select-your-location-to-get-started')}</h1>
      </oryx-heading>
      ${repeat(
        this.locations || [],
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
    `;
  }
}
