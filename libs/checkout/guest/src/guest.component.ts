import { CheckoutComponentMixin } from '@spryker-oryx/checkout';
import { ContentController, RouterService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { subscribe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { Subject, switchMap, take, tap } from 'rxjs';
import { CheckoutGuestOptions, GUEST_SUBMIT_EVENT } from './guest.model';

@hydratable('window:load')
export class CheckoutGuestComponent extends CheckoutComponentMixin<CheckoutGuestOptions>() {
  protected routerService = resolve(RouterService);
  protected options$ = new ContentController(this).getOptions();

  protected handleTrigger$ = new Subject<void>();

  @subscribe()
  protected handle$ = this.handleTrigger$.pipe(
    switchMap(() =>
      this.options$.pipe(
        take(1),
        tap((options) => {
          this.dispatchEvent(
            new CustomEvent(GUEST_SUBMIT_EVENT, {
              bubbles: true,
              composed: true,
            })
          );

          if (options.url) {
            this.routerService.navigate(options.url);
          }
        })
      )
    )
  );

  protected handleProceed(): void {
    this.handleTrigger$.next();
  }

  protected override render(): TemplateResult {
    return html`<oryx-card .header=${i18n('checkout.guest-checkout')}>
      <slot name="content">
        You can checkout without creating an account. You will have a chance to
        create an account later.
      </slot>

      <oryx-button slot="footer" size="small">
        <button @click=${this.handleProceed}>Checkout as a guest</button>
      </oryx-button>
    </oryx-card>`;
  }
}
