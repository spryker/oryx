import { AuthService } from '@spryker-oryx/auth';
import { resolve, Type } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  ConnectableSignal,
  signal,
  signalAware,
  subscribe,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { combineLatest, tap } from 'rxjs';
import { CheckoutDataService, CheckoutOrchestrationService } from '../services';

export declare class CheckoutMixinInterface {
  protected checkoutDataService: CheckoutDataService;
  protected orchestrationService: CheckoutOrchestrationService;

  protected routes: {
    checkout: ConnectableSignal<string | undefined>;
    checkoutLogin: ConnectableSignal<string | undefined>;
  };

  protected isGuest: ConnectableSignal<boolean>;
  protected isAuthenticated: ConnectableSignal<boolean>;
}

export const CheckoutComponentMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<CheckoutMixinInterface> & T => {
  @signalAware()
  class CheckoutMixinClass extends superClass {
    protected authService = resolve(AuthService);
    protected linkService = resolve(SemanticLinkService);
    protected checkoutDataService = resolve(CheckoutDataService);
    protected orchestrationService = resolve(CheckoutOrchestrationService);

    protected routes = {
      checkout: signal(
        this.linkService.get({ type: SemanticLinkType.Checkout })
      ),
      checkoutLogin: signal(
        resolve(SemanticLinkService).get({
          type: SemanticLinkType.CheckoutLogin,
        })
      ),
    };

    protected isAuthenticated = signal(this.authService.isAuthenticated());
    protected isGuest = signal(this.checkoutDataService.isGuestCheckout());

    // TODO: use effect once it is supporting component lifecycle
    @subscribe()
    protected redirect = combineLatest([
      this.checkoutDataService.isGuestCheckout(),
      this.authService.isAuthenticated(),
    ]).pipe(
      tap(([isGuest, isAuthenticated]) => {
        // console.log('guest', isGuest, isAuthenticated);
        const route =
          isGuest || isAuthenticated
            ? this.routes.checkout()
            : this.routes.checkoutLogin();
        if (route) {
          resolve(RouterService).navigate(route);
        }
      })
    );
  }
  return CheckoutMixinClass as unknown as Type<CheckoutMixinInterface> & T;
};
