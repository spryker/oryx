import { fixture } from '@open-wc/testing-helpers';
import { TotalsService } from '@spryker-oryx/cart';
import { mockNormalizedCartTotals } from '@spryker-oryx/cart/mocks';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PriceComponent } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { CartTotalsSubtotalComponent } from './subtotal.component';
import { cartTotalsSubtotalComponent } from './subtotal.def';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

class MockTotalService implements TotalsService {
  get = vi.fn().mockReturnValue(of(mockNormalizedCartTotals));
}

describe('CartTotalsSubtotalComponent', () => {
  let element: CartTotalsSubtotalComponent;
  let service: MockTotalService;

  beforeAll(async () => await useComponent([cartTotalsSubtotalComponent]));

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TotalsService,
          useClass: MockTotalService,
        },
      ],
    });

    service = testInjector.inject<MockTotalService>(TotalsService);

    element = await fixture(
      html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsSubtotalComponent);
  });

  it('should render the content', () => {
    expect(element).toContainElement('span');
    expect(element).toContainElement('oryx-site-price');
  });

  it('should populate the data to the price component', () => {
    const priceComponent =
      element.renderRoot.querySelector<PriceComponent>('oryx-site-price');
    expect(priceComponent?.value).toBe(mockNormalizedCartTotals.subtotal);
    expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
  });

  describe('when there are no totals', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('span, oryx-site-price');
    });
  });
});
