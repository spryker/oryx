import { fixture } from '@open-wc/testing-helpers';
import { TotalsService } from '@spryker-oryx/cart';
import { mockNormalizedCartTotals } from '@spryker-oryx/cart/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PriceComponent } from '@spryker-oryx/site/price';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { CartTotalsTaxComponent } from './tax.component';
import { cartTotalsTaxComponent } from './tax.def';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

class MockTotalService implements TotalsService {
  get = vi.fn().mockReturnValue(of(mockNormalizedCartTotals));
}

describe('CartTotalsTaxComponent', () => {
  let element: CartTotalsTaxComponent;
  let service: MockTotalService;

  beforeAll(async () => await useComponent([cartTotalsTaxComponent]));

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
      html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsTaxComponent);
  });

  it('should render the content', () => {
    expect(element).toContainElement('span');
    expect(element).toContainElement('oryx-site-price');
  });

  it('should populate the data to the price component', () => {
    const priceComponent =
      element.renderRoot.querySelector<PriceComponent>('oryx-site-price');
    expect(priceComponent?.value).toBe(mockNormalizedCartTotals.taxTotal);
    expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
  });

  describe('when there are no totals', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('span, oryx-site-price');
    });
  });
});
