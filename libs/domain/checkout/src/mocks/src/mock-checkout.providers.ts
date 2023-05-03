import {
  CheckoutPaymentService,
  CheckoutProcessState,
  CheckoutService,
  CheckoutShipmentService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MockPaymentService } from './mock-payment.service';
import { MockShipmentService } from './mock-shipment.service';

export class MockCheckoutService implements Partial<CheckoutService> {
  register = vi.fn();
  getProcessState = vi
    .fn()
    .mockReturnValue(of(CheckoutProcessState.Initializing));

  placeOrder = vi.fn().mockReturnValue(of());
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

export const mockCheckoutProviders: Provider[] = [
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
    provide: CheckoutService,
    useClass: MockCheckoutService,
  },
];
