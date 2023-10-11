import { fixture } from '@open-wc/testing-helpers';
import { TotalsService } from '@spryker-oryx/cart';
import { mockNormalizedCartTotals } from '@spryker-oryx/cart/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { SitePriceComponent } from '@spryker-oryx/site/price';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { CartTotalsDeliveryComponent } from './delivery.component';
import { cartTotalsDeliveryComponent } from './delivery.def';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

class MockTotalService implements TotalsService {
  get = vi.fn().mockReturnValue(of(mockNormalizedCartTotals));
}

describe('CartTotalsDeliveryComponent', () => {
  let element: CartTotalsDeliveryComponent;
  let service: MockTotalService;

  beforeAll(async () => await useComponent([cartTotalsDeliveryComponent]));

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
      html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsDeliveryComponent);
  });

  it('should render the content', () => {
    const priceComponent =
      element.renderRoot.querySelector<SitePriceComponent>(`oryx-site-price`);
    expect(element).toContainElement('span');
    expect(element).toContainElement('oryx-site-price');
    expect(priceComponent?.value).toBe(mockNormalizedCartTotals.shipmentTotal);
    expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
  });

  describe('when shipmentTotal is zero', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of({ shipmentTotal: 0 }));
      element = await fixture(
        html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
      );
    });

    it('should render Free as cost', () => {
      expect(element).toContainElement('span.free');
    });
  });

  describe('when there are no totals', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
      );
    });

    it('should render unknown delivery message', () => {
      expect(element).toContainElement('span.unknown-message');
    });
  });
});
