import {
  CheckoutMixin,
  CheckoutPaymentService,
  PaymentMethod,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { map, Observable, tap } from 'rxjs';
import { styles } from './payment.styles';

@hydratable('window:load')
export class CheckoutPaymentComponent extends CheckoutMixin(LitElement) {
  static styles = styles;

  protected paymentService = resolve(CheckoutPaymentService);
  protected methods = signal(this.paymentService.getMethods());
  protected selected = signal(this.paymentService.selected());

  connectedCallback(): void {
    super.connectedCallback();
    this.checkoutService.register('payments', () => this.collect());
  }

  protected override render(): TemplateResult | void {
    const methods = this.methods();

    if (!methods?.length) return this.renderEmpty();

    return html`<h3>${i18n('checkout.steps.payment')}</h3>
      ${methods.map((method) => this.renderMethod(method))}`;
  }

  protected renderMethod(method: PaymentMethod): TemplateResult {
    const selected = this.isSelected(method.id);
    return html`<oryx-tile ?selected=${selected}>
      <oryx-radio>
        <input
          name="shipment-method"
          type="radio"
          value=${method.id}
          ?checked=${selected}
          @change=${this.onChange}
        />
        ${method.name}
        <span slot="subtext">
          ${i18n('checkout.payment.select-<method>', {
            method: method.name,
          })}
        </span>
      </oryx-radio>
    </oryx-tile>`;
  }

  protected renderEmpty(): TemplateResult {
    return html`<p class="no-methods">
      ${i18n('checkout.payment.no-methods-available')}
    </p>`;
  }

  protected isSelected(methodId: string): boolean {
    if (!this.selected()) {
      this.autoSelect(methodId);
    }
    return this.selected()?.id === methodId;
  }

  // TODO: consider fallback strategies: none, first, cheapest, fastest
  protected autoSelect(methodId: string): void {
    if (methodId === this.methods()?.[0]?.id) {
      this.paymentService.select(methodId);
    }
  }

  protected collect(): Observable<PaymentMethod[] | null> {
    return this.paymentService.selected().pipe(
      tap((selected) => {
        // if (!selected) // TODO: how to show invalidation here?
      }),
      map((p) => (p ? [p] : null))
    );
  }

  protected onChange(e: Event): void {
    const id = (e.target as HTMLInputElement).value;
    if (id && id !== this.selected()?.id) {
      this.paymentService.select(id);
    }
  }
}
