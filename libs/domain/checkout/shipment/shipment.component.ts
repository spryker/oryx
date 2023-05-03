import {
  CheckoutMixin,
  CheckoutShipmentService,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { hydratable, i18n, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { map, Observable, tap } from 'rxjs';
import { styles } from './shipment.styles';

@signalAware()
@hydratable('window:load')
export class CheckoutShipmentComponent extends CheckoutMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  protected shipmentService = resolve(CheckoutShipmentService);

  protected carriers = signal(this.shipmentService.getCarriers());
  protected selected = signal(this.shipmentService.selected());

  connectedCallback(): void {
    super.connectedCallback();
    this.checkoutService.register('shipment', () => this.collectData());
  }

  protected override render(): TemplateResult | void {
    const carriers = this.carriers();

    if (!carriers?.find((carrier) => carrier.shipmentMethods?.length > 0))
      return this.renderEmpty();

    return html`<h3>${i18n('checkout.steps.shipment')}</h3>
      ${carriers.map(
        (carrier) => html`
          ${when(carriers.length > 1, () => html`<p>${carrier.name}</p>`)}
          ${carrier.shipmentMethods.map((method) => this.renderMethod(method))}
        `
      )}`;
  }

  protected renderMethod(method: ShipmentMethod): TemplateResult {
    const isSelected = this.isSelected(method.id);
    return html`<oryx-tile ?selected=${isSelected}>
      <oryx-radio>
        <input
          name="shipment"
          type="radio"
          value=${method.id}
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

  protected isSelected(methodId: string): boolean {
    if (!this.selected()) {
      this.autoSelect(methodId);
    }
    return this.selected()?.id === methodId;
  }

  // TODO: consider fallback strategies: none, first, cheapest, fastest
  protected autoSelect(methodId: string): void {
    if (methodId === this.carriers()?.[0]?.shipmentMethods?.[0]?.id) {
      this.shipmentService.select(methodId);
    }
  }

  protected onChange(e: Event): void {
    const id = (e.target as HTMLInputElement).value;
    this.shipmentService.select(id);
  }

  protected collectData(): Observable<{
    idShipmentMethod: string;
  } | null> {
    return this.shipmentService.selected().pipe(
      tap((selected) => {
        if (!selected) {
          // TODO: how to show invalidation here?
        }
      }),
      map((shipment) => (shipment ? { idShipmentMethod: shipment.id } : null))
    );
  }

  protected renderEmpty(): TemplateResult {
    return html`<oryx-icon type="carrier"></oryx-icon>
      <p class="no-methods">
        ${i18n('checkout.no-shipment-methods-available')}
      </p>`;
  }
}
