import { CheckoutMixin, isValid, ShipmentMethod } from '@spryker-oryx/checkout';
import { ContentMixin } from '@spryker-oryx/experience';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { styles } from './shipment.styles';

@signalAware()
@hydratable('window:load')
export class CheckoutShipmentComponent
  extends CheckoutMixin(ContentMixin(LitElement))
  implements isValid
{
  static styles = styles;

  protected shipments = signal(this.checkoutDataService.get('shipments'));
  protected selected = signal(this.checkoutStateService.get('shipment'));

  @query('form')
  protected form?: HTMLFormElement;

  isValid(report: boolean): boolean {
    if (!this.form?.checkValidity() && report) {
      this.form?.reportValidity();
    }
    return !!this.form?.checkValidity();
  }

  protected override render(): TemplateResult | void {
    const carriers = this.shipments()?.[0]?.carriers;

    if (!carriers?.find((carrier) => !!carrier.shipmentMethods?.length))
      return this.renderEmpty();

    return html`<h3>${i18n('checkout.steps.shipment')}</h3>
      <form>
        ${carriers.map(
          (carrier) => html`
            ${when(carriers.length > 1, () => html`<p>${carrier.name}</p>`)}
            ${carrier.shipmentMethods.map((method) =>
              this.renderMethod(method)
            )}
          `
        )}
      </form> `;
  }

  protected renderMethod(method: ShipmentMethod): TemplateResult {
    const isSelected = this.isSelected(method.id);
    return html`<oryx-tile ?selected=${isSelected}>
      <oryx-radio>
        <input
          name="shipment"
          type="radio"
          value=${method.id}
          required
          ?checked=${isSelected}
          @change=${this.onChange}
        />
        <div>
          <span>${method.name}</span>
          <oryx-price .value=${method.price}></oryx-price>
        </div>
        <oryx-date
          slot="subtext"
          .stamp=${method.deliveryTime}
          .i18nToken=${'checkout.delivered-at-<date>'}
        ></oryx-date>
      </oryx-radio>
    </oryx-tile>`;
  }

  /**
   * Evaluates whether the given method id is the selected method.
   * If there's no method selected, a method can be auto selected.
   */
  protected isSelected(methodId: string): boolean {
    if (!this.selected()) this.autoSelect(methodId);
    return this.selected()?.idShipmentMethod === methodId;
  }

  protected onChange(e: Event): void {
    this.select((e.target as HTMLInputElement).value);
  }

  protected autoSelect(methodId: string): void {
    if (
      methodId ===
      this.shipments()?.[0]?.carriers?.[0]?.shipmentMethods?.[0]?.id
    ) {
      this.select(methodId);
    }
  }

  protected select(id?: string): void {
    const value = id ? { idShipmentMethod: id } : null;
    this.checkoutStateService.set('shipment', {
      value,
      valid: true,
    });
  }

  protected renderEmpty(): TemplateResult {
    return html`<oryx-icon type="carrier"></oryx-icon>
      <p class="no-methods">
        ${i18n('checkout.no-shipment-methods-available')}
      </p>`;
  }
}
