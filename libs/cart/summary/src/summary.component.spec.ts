import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { PricingService, SemanticLinkService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartSummaryComponent } from './summary.component';
import { cartSummaryComponent } from './summary.def';
import { CartSummaryOptions } from './summary.model';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of('/cart'));
}

class mockPricingService {
  format = vi.fn();
}

describe('CartSummaryComponent', () => {
  let element: CartSummaryComponent;
  let service: MockCartService;

  beforeAll(async () => {
    await useComponent(cartSummaryComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the total quantity = 0', () => {
    const quantity = 0;

    beforeEach(async () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity }] }));
      element = await fixture(
        html`<oryx-cart-summary uid="1"></oryx-cart-summary>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should not render the quantity mark', () => {
      expect(element).not.toContainElement('mark');
    });
  });

  describe('when the total quantity = 100', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity: 100 }] }));
    });

    describe('and the maxVisibleQuantity is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-summary uid="1"></oryx-cart-summary>`
        );
      });

      it('should render the exact quantity mark', () => {
        expect(element).toContainElement('mark');
        expect(element.renderRoot.querySelector('mark')?.textContent).toContain(
          '100'
        );
      });
    });

    describe('and the maxVisibleQuantity option is set to 99', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-summary
            uid="1"
            .options=${{ maxVisibleQuantity: 99 } as CartSummaryOptions}
          ></oryx-cart-summary>`
        );
      });

      it('should render 99+ in the quantity mark', () => {
        expect(element.renderRoot.querySelector('mark')?.textContent).toContain(
          '99+'
        );
      });
    });
  });
});
