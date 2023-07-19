import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { PricingService } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartEntriesComponent } from './entries.component';
import { cartEntriesComponent } from './entries.def';

class MockCartService implements Partial<CartService> {
  isBusy = vi.fn().mockReturnValue(of(false));
  isEmpty = vi.fn().mockReturnValue(of(false));
  getCart = vi.fn().mockReturnValue(of());
  getEntries = vi.fn().mockReturnValue(of([]));
}

class mockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

describe('CartEntriesComponent', () => {
  let element: CartEntriesComponent;
  let service: MockCartService;

  const entry = { groupKey: '1', sku: '1', quantity: 1 };

  beforeAll(async () => {
    await useComponent(cartEntriesComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
      ],
    });
    element = await fixture(html`<oryx-cart-entries></oryx-cart-entries>`);

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => destroyInjector());

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the cart is empty', () => {
    beforeEach(async () => {
      service.isEmpty = vi.fn().mockReturnValue(of(true));
      element = await fixture(html`<oryx-cart-entries></oryx-cart-entries>`);
    });

    it('should render an empty section', () => {
      expect(element).toContainElement('section.empty');
    });
  });

  describe('when cart contains entries', () => {
    beforeEach(async () => {
      service.getEntries = vi.fn().mockReturnValue(of([entry]));
      element = await fixture(html`<oryx-cart-entries></oryx-cart-entries>`);
    });

    it('should render the entry', () => {
      expect(element).toContainElement('oryx-cart-entry');
    });
  });

  describe('options', () => {
    describe('when the readonly option is true', () => {
      beforeEach(async () => {
        service.getEntries = vi.fn().mockReturnValue(of([entry]));
        element = await fixture(
          html`<oryx-cart-entries
            .options=${{ readonly: true }}
          ></oryx-cart-entries>`
        );
      });

      it('should render the entry', () => {
        expect(element).toContainElement('oryx-cart-entry[readonly]');
      });
    });
  });
});
