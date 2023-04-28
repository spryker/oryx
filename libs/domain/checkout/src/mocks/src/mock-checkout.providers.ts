import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutPaymentService,
  CheckoutService,
  CheckoutShipmentService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MockCheckoutService } from './mock-checkout.service';
import { MockPaymentService } from './mock-payment.service';
import { MockShipmentService } from './mock-shipment.service';

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  isGuestCheckout = vi.fn().mockReturnValue(of(false));
  setGuestCheckout = vi.fn();

  getContactDetails = vi.fn().mockReturnValue(of({}));
  getAddressDetails = vi.fn().mockReturnValue(of({}));
}

export class MockCheckoutOrchestrationService
  implements Partial<CheckoutOrchestrationService>
{
  getTrigger = vi.fn().mockReturnValue(of());
  report = vi.fn();
}

export class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

export const mockCheckoutProviders: Provider[] = [
  {
    provide: AuthService,
    useClass: MockAuthService,
  },
  {
    provide: RouterService,
    useClass: MockRouterService,
  },
  {
    provide: SemanticLinkService,
    useClass: MockSemanticLinkService,
  },
  {
    provide: CheckoutShipmentService,
    useClass: MockShipmentService,
  },
  {
    provide: CheckoutPaymentService,
    useClass: MockPaymentService,
  },
  {
    provide: CheckoutDataService,
    useClass: MockCheckoutDataService,
  },
  {
    provide: CheckoutOrchestrationService,
    useClass: MockCheckoutOrchestrationService,
  },
  {
    provide: CheckoutService,
    useClass: MockCheckoutService,
  },
];
