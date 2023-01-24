import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { CheckoutGuestComponent } from './guest.component';
import { checkoutGuestComponent } from './guest.def';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('Checkout Guest', () => {
  let element: CheckoutGuestComponent;
  let service: MockRouterService;

  beforeAll(async () => {
    await useComponent(checkoutGuestComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    service = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<checkout-guest uid="1"></checkout-guest>`);

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('handle guest', () => {
    it('should expose guest-submit event', async () => {
      const callback = vi.fn();
      element = await fixture(
        html`<checkout-guest @oryx.guest-submit=${callback}></checkout-guest>`
      );
      const button = element.renderRoot.querySelector('button');
      button?.click();

      expect(callback).toHaveBeenCalled();
    });

    it('redirect if url option was provided', async () => {
      const url = 'https://www.dummy.url/';
      element = await fixture(
        html`<checkout-guest .options=${{ url }}></checkout-guest>`
      );
      const button = element.renderRoot.querySelector('button');
      button?.click();

      expect(service.navigate).toHaveBeenCalled();
    });

    it('not redirect if no url option', async () => {
      element = await fixture(html`<checkout-guest></checkout-guest>`);
      const button = element.renderRoot.querySelector('button');
      button?.click();

      expect(service.navigate).not.toHaveBeenCalled();
    });
  });
});
