import { CartService } from '@spryker-oryx/cart';
import { CheckoutMixin } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { map, Observable } from 'rxjs';
import { CheckoutOrchestratorComponentOptions } from './orchestrator.model';
import { compositionStyles } from './orchestrator.styles';

@hydratable('window:load')
export class CheckoutOrchestratorComponent extends CheckoutMixin(
  ContentMixin<CheckoutOrchestratorComponentOptions>(LitElement)
) {
  static styles = [compositionStyles];

  // protected hasEmptyCart = signal(resolve(CartService).isEmpty());
  // protected requiresRedirect = computed(
  //   () =>
  //     this.$options().checkoutAuthPage &&
  //     !this.isGuest() &&
  //     !this.isAuthenticated()
  // );
  protected cartService = resolve(CartService);

  connectedCallback(): void {
    // if (this.requiresRedirect()) {
    //   const route = this.$options().checkoutAuthPage;
    //   if (route) resolve(RouterService).navigate(route);
    // }
    super.connectedCallback();

    this.checkoutService.register('cartId', () => this.collectCartId());
  }

  protected collectCartId(): Observable<string | undefined> {
    return this.cartService.getCart().pipe(map((cart) => cart?.id));
  }

  protected override render(): TemplateResult | void {
    if (!this.isAvailable()) return;

    return html`
      <experience-composition .uid=${this.uid}></experience-composition>
    `;
  }
}
