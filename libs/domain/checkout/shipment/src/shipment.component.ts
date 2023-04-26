import {
  CheckoutComponentMixin,
  CheckoutOrchestrationService,
  CheckoutShipmentService,
  CheckoutStepType,
  CheckoutTrigger,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  asyncValue,
  effect,
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
export class CheckoutShipmentComponent extends CheckoutComponentMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  protected shipmentService = resolve(CheckoutShipmentService);
  protected orchestrationService = resolve(CheckoutOrchestrationService);
  protected localeService = resolve(LocaleService);

  protected carriers = signal(this.shipmentService.getCarriers());
  protected selected = signal(this.shipmentService.getSelectedShipmentMethod());

  // TODO: consider moving to effect whenever component life cycle is supported
  @subscribe()
  protected triggerValidation = this.orchestrationService
    .getTrigger(CheckoutStepType.Shipping)
    .pipe(tap((trigger) => this.report(trigger)));

  protected eff = effect(() => {
    if (!this.selected() && this.carriers()?.length) {
      this.select(Number(this.carriers()?.[0]?.shipmentMethods?.[0].id));
    }
  });

  protected override render(): TemplateResult | void {
    const carriers = this.carriers();

    if (!carriers?.length) return this.renderEmpty();

    return html` <h3>${i18n('checkout.steps.shipment')}</h3>
      ${carriers.map(
        (carrier) => html`
          ${when(carriers.length > 1, () => html`<p>${carrier.name}</p>`)}
          ${carrier.shipmentMethods.map((method, i) =>
            this.renderMethod(method)
          )}
        `
      )}`;
  }

  protected renderMethod(method: ShipmentMethod): TemplateResult {
    const isSelected = Number(method.id) === this.selected();
    return html`<oryx-tile ?selected="${isSelected}">
      <oryx-radio>
        <input
          name="shipment-method"
          type="radio"
          value="${method.id}"
          ?checked="${isSelected}"
          @change="${this.onChange}"
        />
        <div>
          <span>${method.name}</span>
          <oryx-price .value=${method.price}></oryx-price>
        </div>
        ${when(
          method.deliveryTime,
          () =>
            html`${asyncValue(
              this.localeService.formatDate(method.deliveryTime!),
              (date) => html`<small slot="subtext">
                ${i18n('checkout.delivered-at-<date>', { date })}
              </small>`
            )}`
        )}
      </oryx-radio>
    </oryx-tile>`;
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
    if (id) this.select(Number(id));
  }

  protected select(methodId?: number): void {
    if (methodId && methodId !== this.selected()) {
      this.shipmentService.setShipmentMethod(methodId);
    }
  }

  protected renderEmpty(): TemplateResult {
    return html`<oryx-icon type="carrier"></oryx-icon>
      <p class="no-methods">
        ${i18n('checkout.no-shipment-methods-available')}
      </p>`;
  }
}
