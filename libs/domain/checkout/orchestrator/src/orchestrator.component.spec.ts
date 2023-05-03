import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockCheckoutProviders } from '../../src/mocks/src';
import { CheckoutOrchestratorComponent } from './orchestrator.component';
import { checkoutCompositionComponent } from './orchestrator.def';

export class MockCartService implements Partial<CartService> {
  isEmpty = vi.fn().mockReturnValue(of(false));
}

describe('CheckoutCompositionComponent', () => {
  let element: CheckoutOrchestratorComponent;

  beforeAll(async () => {
    await useComponent(checkoutCompositionComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: CartService,
          useClass: MockCartService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-checkout-composition></oryx-checkout-composition>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
