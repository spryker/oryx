import {
  CheckoutShipmentService,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { ComponentMixin } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { LocaleService, PricingService } from '@spryker-oryx/site';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { styles } from './shipment-selector.styles';

@hydratable('window:load')
export class CheckoutShipmentSelectorComponent extends ComponentMixin() {
  static styles = styles;

  protected shipmentService = resolve(CheckoutShipmentService);
  protected priceService = resolve(PricingService);
  protected localeService = resolve(LocaleService);

  protected carriers$ = this.shipmentService.getCarriers();
  protected selectedShipmentMethod$ =
    this.shipmentService.getSelectedShipmentMethod();

  protected renderMethod(
    method: ShipmentMethod,
    selected = false
  ): TemplateResult {
    return html`<oryx-tile
      ><div class="content">
        <oryx-radio>
          <input
            name="shipment-method"
            type="radio"
            ?checked="${selected}"
          />${method.name}</oryx-radio
        >
        <span class="price"
          >${asyncValue(
            this.priceService.format(method.price),
            (price) => html`${price}`
          )}</span
        >
        ${when(
          method.deliveryTime,
          () =>
            html`${asyncValue(
              this.localeService.formatDate(method.deliveryTime!),
              (date) => html`<small class="delivery"
                >${i18n('checkout.delivered-at-{date}', { date })}
              </small>`
            )}`
        )}
      </div></oryx-tile
    >`;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      combineLatest([this.carriers$, this.selectedShipmentMethod$]),
      ([carriers, selectedShipmentMethod]) => {
        if (!carriers?.length) {
          return html`<oryx-icon type="carrier"></oryx-icon>
            <div class="no-methods">
              ${i18n('checkout.no-shipment-methods-available')}
            </div>`;
        }
        return html`${carriers.map(
          (carrier, i) => html`${when(
            carriers.length > 1,
            () => html`<h3>${carrier.name}</h3>`
          )}
          ${carrier.shipmentMethods.map((item, j) =>
            this.renderMethod(
              item,
              selectedShipmentMethod === 0
                ? i === 0 && j === 0
                : selectedShipmentMethod == item.id
            )
          )}`
        )}`;
      }
    )}`;
  }
}
