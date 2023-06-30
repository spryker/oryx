import { fixture } from '@open-wc/testing-helpers';
import { TotalsService } from '@spryker-oryx/cart';
import {
  mockNormalizedCartTotals,
  mockNormalizedCartTotalsNetMode,
} from '@spryker-oryx/cart/mocks';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PriceComponent } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { CartTotalsTotalComponent } from './total.component';
import { cartTotalsTotalComponent } from './total.def';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

class MockTotalService implements TotalsService {
  get = vi.fn().mockReturnValue(of(mockNormalizedCartTotals));
}

describe('CartTotalsTotalComponent', () => {
  let element: CartTotalsTotalComponent;
  let service: MockTotalService;

  beforeAll(async () => await useComponent([cartTotalsTotalComponent]));

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
      html`<oryx-cart-totals-total></oryx-cart-totals-total>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsTotalComponent);
  });

  it('should render the content', () => {
    expect(element).toContainElement('span');
    expect(element).toContainElement('oryx-site-price');
    const message = element.renderRoot.querySelector('oryx-site-price + span');
    expect(message?.textContent).toContain('Tax included');
  });

  it('should render the content', () => {
    expect(element).toContainElement('span');
    expect(element).toContainElement('oryx-site-price');
  });

  it('should populate the data to the price component', () => {
    const priceComponent =
      element.renderRoot.querySelector<PriceComponent>('oryx-site-price');
    expect(priceComponent?.value).toBe(mockNormalizedCartTotals.priceToPay);
    expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
  });

  describe('when there are no totals', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-cart-totals-total></oryx-cart-totals-total>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('span, oryx-site-price');
    });
  });

  describe('when totals has net price mode', () => {
    beforeEach(async () => {
      service.get = vi
        .fn()
        .mockReturnValue(of(mockNormalizedCartTotalsNetMode));
      element = await fixture(
        html`<oryx-cart-totals-total></oryx-cart-totals-total>`
      );
    });

    it('should render net mode message', () => {
      const message = element.renderRoot.querySelector(
        'oryx-site-price + span'
      );
      expect(message?.textContent).toContain('Tax excluded');
    });
  });

  describe('when enableTaxMessage option is falsy', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-totals-total
          .options=${{ enableTaxMessage: false }}
        ></oryx-cart-totals-total>`
      );
    });

    it('should not render the tax message', () => {
      expect(element).not.toContainElement('oryx-site-price + span');
    });
  });
});
