import {
  CheckoutMixin,
  CheckoutShipmentService,
  CheckoutStepType,
  CheckoutTrigger,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import {
  hydratable,
  i18n,
  signal,
  signalAware,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { styles } from './shipment.styles';

@signalAware()
@hydratable('window:load')
export class CheckoutShipmentComponent extends CheckoutMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  protected shipmentService = resolve(CheckoutShipmentService);

  protected carriers = signal(this.shipmentService.getCarriers());
  protected selected = signal(this.shipmentService.getSelected());

  // TODO: consider moving to effect whenever component life cycle is supported
  @subscribe()
  protected triggerValidation = this.orchestrationService
    .getTrigger(CheckoutStepType.Shipping)
    .pipe(tap((trigger) => this.report(trigger)));

  protected override render(): TemplateResult | void {
    const carriers = this.carriers();

    if (!carriers?.length) return this.renderEmpty();

    return html`<h3>${i18n('checkout.steps.shipment')}</h3>
      ${carriers.map(
        (carrier) => html`
          ${when(carriers.length > 1, () => html`<p>${carrier.name}</p>`)}
          ${carrier.shipmentMethods.map((method) => this.renderMethod(method))}
        `
      )}`;
  }

  protected renderMethod(method: ShipmentMethod): TemplateResult {
    const isSelected = this.isSelected(Number(method.id));
    return html`<oryx-tile ?selected=${isSelected}>
      <oryx-radio>
        <input
          name="shipment-method"
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

  // TODO: consider fallback strategies: none, first, cheapest, fastest
  protected isSelected(methodId: number): boolean {
    return this.selected()
      ? this.selected() === methodId
      : methodId === this.carriers()?.[0]?.shipmentMethods?.[0]?.id;
  }

  protected report(action: CheckoutTrigger): void {
    if (action === CheckoutTrigger.Check) {
      this.orchestrationService.report(
        CheckoutStepType.Shipping,
        !!this.selected()
      );
    }
  }

  protected onChange(e: Event): void {
    const id = (e.target as HTMLInputElement).value;
    if (id && Number(id) !== this.selected()) {
      this.shipmentService.setShipmentMethod(Number(id));
    }
  }

  protected renderEmpty(): TemplateResult {
    return html`<oryx-icon type="carrier"></oryx-icon>
      <p class="no-methods">
        ${i18n('checkout.no-shipment-methods-available')}
      </p>`;
  }
}
