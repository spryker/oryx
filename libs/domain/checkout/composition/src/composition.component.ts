import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutComponentMixin,
  CheckoutOrchestrationService,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { AddressService } from '@spryker-oryx/user';
import { computed, hydratable, i18n, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { map } from 'rxjs';
import { compositionStyles } from './composition.styles';

@hydratable('window:load')
export class CheckoutCompositionComponent extends CheckoutComponentMixin(
  ContentMixin(LitElement)
) {
  static styles = compositionStyles;

  protected hasEmptyCart = computed(() => resolve(CartService).isEmpty());
  protected hasAddresses = signal(
    resolve(AddressService)
      .getAddresses()
      .pipe(map((addresses) => !!addresses?.length))
  );

  protected orchestrationService = resolve(CheckoutOrchestrationService);
  // protected steps = signal(this.orchestrationService.getValidity());

  protected override render(): TemplateResult | void {
    if (!this.isAuthenticated() && !this.isGuest()) return;

    if (this.hasEmptyCart()) return html`empty...`;

    return html`
      <experience-composition .uid=${this.uid}></experience-composition>
    `;
    // ${this.steps()?.map((_, index) => html`${this.renderStep(index)}`)}
  }

  // protected renderStep(index: number): TemplateResult | void {
  //   let content: TemplateResult | void;

  //   const step = this.steps()?.[index];

  //   if (!step) return;

  //   const heading = html`<h2>
  //     ${this.renderHeading(index)}
  //     ${when(index === 0, () => this.renderGuestLoginLink())}
  //   </h2>`;

  //   switch (step.id) {
  //     case CheckoutStepType.Delivery:
  //       content = html` <checkout-delivery></checkout-delivery>`;
  //       break;
  //     case CheckoutStepType.Shipping:
  //       content = html`<checkout-shipment></checkout-shipment>`;
  //       break;
  //     case CheckoutStepType.Payment:
  //       content = html` <checkout-payment></checkout-payment>`;
  //       break;
  //   }

  //   return html`${heading}${content}`;
  // }

  // protected renderHeading(index: number): TemplateResult | void {
  //   const step = this.steps()?.[index];
  //   if (!step) return;
  //   return html`${i18n(`checkout.steps.<step>-${step.id}`, {
  //     step: index + 1,
  //   })}`;
  // }

  /**
   * If guest checkout has been used, we offer a link back to authenticate.
   */
  protected renderGuestLoginLink(): TemplateResult | void {
    console.log(this.isGuest());
    console.log(this.isAuthenticated());
    if (this.isAuthenticated() || !this.isGuest()) return;

    return html`<oryx-link @click=${() => this.setGuest(false)}>
      <a href=${this.routes.checkoutLogin()}
        >${i18n('checkout.guest.back-to-login')}</a
      >
    </oryx-link>`;
  }

  protected setGuest(value = true): void {
    this.checkoutDataService.setGuestCheckout(value);
  }
}
