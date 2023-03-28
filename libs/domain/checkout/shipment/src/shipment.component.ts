import {
  CheckoutOrchestrationService,
  CheckoutShipmentService,
  CheckoutStepType,
  CheckoutTrigger,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ComponentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { PricingService } from '@spryker-oryx/site';
import {
  asyncValue,
  hydratable,
  i18n,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { styles } from './shipment.styles';

@hydratable('window:load')
export class CheckoutShipmentComponent extends ComponentMixin() {
  static styles = styles;

  protected shipmentService = resolve(CheckoutShipmentService);
  protected priceService = resolve(PricingService);
  protected localeService = resolve(LocaleService);
  protected orchestrationService = resolve(CheckoutOrchestrationService);

  protected carriers$ = this.shipmentService.getCarriers();
  protected currentMethod$ = new BehaviorSubject<string | number | null>(null);
  protected selectedShipmentMethod$ =
    this.shipmentService.getSelectedShipmentMethod();

  @subscribe()
  protected submitTrigger$ = this.orchestrationService
    .getTrigger(CheckoutStepType.Shipping)
    .pipe(
      switchMap((trigger) => {
        return this.submit().pipe(
          tap((valid) => {
            if (trigger === CheckoutTrigger.Check) {
              this.orchestrationService.report(
                CheckoutStepType.Shipping,
                valid
              );
            }
          })
        );
      })
    );

  submit(): Observable<boolean> {
    const selected = this.renderRoot.querySelector(
      'input[checked]'
    ) as HTMLInputElement;

    if (selected) {
      return this.shipmentService
        .setShipmentMethod(parseInt(selected.value))
        .pipe(map(() => true));
    }

    return of(false);
  }

  protected renderMethod(
    method: ShipmentMethod,
    selected = false
  ): TemplateResult {
    return html`<oryx-tile ?selected="${selected}">
      <oryx-radio>
        <input
          name="shipment-method"
          type="radio"
          value="${method.id}"
          ?checked="${selected}"
          @change="${(e: Event) => this.onChange(e, method.id)}"
        />
        <div>
          <span>${method.name}</span>
          <span class="price">
            ${asyncValue(this.priceService.format(method.price))}
          </span>
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

  protected onChange(e: Event, methodId: string | number): void {
    this.currentMethod$.next(methodId);
    this.orchestrationService.report(CheckoutStepType.Shipping, true);
  }

  protected renderEmpty(): TemplateResult {
    return html`<oryx-icon type="carrier"></oryx-icon>
      <p class="no-methods">
        ${i18n('checkout.no-shipment-methods-available')}
      </p>`;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(
      combineLatest([
        this.carriers$,
        this.selectedShipmentMethod$,
        this.currentMethod$,
      ]),
      ([carriers, selectedShipmentMethod, currentMethod]) =>
        !carriers?.length
          ? this.renderEmpty()
          : html`${carriers.map(
              (carrier, i) => html`${when(
                carriers.length > 1,
                () => html`<p>${carrier.name}</p>`
              )}
              ${carrier.shipmentMethods.map((item, j) =>
                this.renderMethod(
                  item,
                  currentMethod
                    ? currentMethod === item.id
                    : selectedShipmentMethod === 0
                    ? i === 0 && j === 0
                    : selectedShipmentMethod == item.id
                )
              )}`
            )}`
    )}`;
  }
}
