import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html } from 'lit';
import { CheckoutGuestComponent } from '../guest';
import { mockCheckoutProviders } from '../src/mocks/src';
import { CheckoutDataService, CheckoutStateService } from '../src/services';
import { checkoutGuestComponent } from './guest.def';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
}

describe('CheckoutGuestComponent', () => {
  let element: CheckoutGuestComponent;
  let formRenderer: MockFormRenderer;
  let checkoutDataService: MockCheckoutDataService;
  let checkoutStateService: MockCheckoutStateService;

  beforeAll(async () => {
    await useComponent(checkoutGuestComponent);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: CheckoutStateService,
          useClass: MockCheckoutStateService,
        },
      ],
    });

    checkoutDataService =
      injector.inject<MockCheckoutDataService>(CheckoutDataService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    formRenderer = injector.inject<MockFormRenderer>(FormRenderer);

    formRenderer.buildForm.mockReturnValue(
      html`<input type="email" name="email" placeholder="email" required />`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
    });

    it('should be an instance of CheckoutGuestComponent', () => {
      expect(element).toBeInstanceOf(CheckoutGuestComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});
