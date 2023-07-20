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
import { CartTotalsDiscountComponent } from './discount.component';
import { cartTotalsDiscountComponent } from './discount.def';
import { DiscountRowsAppearance } from './discount.model';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

class MockTotalService implements TotalsService {
  get = vi.fn().mockReturnValue(of(mockNormalizedCartTotals));
}

describe('CartTotalsDiscountComponent', () => {
  let element: CartTotalsDiscountComponent;
  let service: MockTotalService;

  const expectedDiscounts = () => {
    mockNormalizedCartTotals.discounts?.forEach(
      ({ displayName, amount }, i) => {
        it(`should populate correct data to the discount #${displayName}`, () => {
          const heading = element.renderRoot.querySelector(
            `ul > li:nth-child(${i + 1}) span`
          );
          expect(heading?.textContent).toContain(displayName);
          const priceComponent =
            element.renderRoot.querySelector<PriceComponent>(
              `ul > li:nth-child(${i + 1}) oryx-site-price`
            );
          expect(priceComponent?.value).toBe(-amount);
          expect(priceComponent?.currency).toBe(
            mockNormalizedCartTotals.currency
          );
        });
      }
    );
  };

  beforeAll(async () => await useComponent([cartTotalsDiscountComponent]));

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
      html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsDiscountComponent);
  });

  it('should render opened collapsible with discounts', () => {
    expect(element).toContainElement('oryx-collapsible[open] > ul');
  });

  it('should render heading with correct amount of discounts', () => {
    const heading = element.renderRoot.querySelector('span[slot="heading"]');

    expect(heading?.textContent).toContain(
      `${mockNormalizedCartTotals.discounts?.length} discounts`
    );
  });

  it('should populate the data to the price component', () => {
    const priceComponent = element.renderRoot.querySelector<PriceComponent>(
      'oryx-site-price[slot="aside"]'
    );
    expect(priceComponent?.value).toBe(
      -mockNormalizedCartTotals.discountTotal!
    );
    expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
  });

  expectedDiscounts();

  describe('when discountRowsAppearance options is collapsed', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-totals-discount
          .options=${{
            discountRowsAppearance: DiscountRowsAppearance.Collapsed,
          }}
        ></oryx-cart-totals-discount>`
      );
    });

    it('should not open the collapsible', () => {
      expect(element).toContainElement('oryx-collapsible:not([open])');
    });
  });

  describe('when discountRowsAppearance options is inline', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-totals-discount
          .options=${{ discountRowsAppearance: DiscountRowsAppearance.Inline }}
        ></oryx-cart-totals-discount>`
      );
    });

    it('should render heading with correct amount of discounts', () => {
      const heading = element.renderRoot.querySelector('span');

      expect(heading?.textContent).toContain(
        `${mockNormalizedCartTotals.discounts?.length} discounts`
      );
    });

    it('should populate the data to the price component', () => {
      const priceComponent =
        element.renderRoot.querySelector<PriceComponent>('oryx-site-price');
      expect(priceComponent?.value).toBe(
        -mockNormalizedCartTotals.discountTotal!
      );
      expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
    });

    expectedDiscounts();

    describe('and there is no discounts', () => {
      beforeEach(async () => {
        service.get = vi
          .fn()
          .mockReturnValue(
            of({ ...mockNormalizedCartTotals, discounts: undefined })
          );
        element = await fixture(
          html`<oryx-cart-totals-discount
            .options=${{
              discountRowsAppearance: DiscountRowsAppearance.Inline,
            }}
          ></oryx-cart-totals-discount>`
        );
      });

      it('should render heading with proper text', () => {
        const heading = element.renderRoot.querySelector('span');
        expect(heading?.textContent).toContain('Discounts');
      });

      it('should not render the discounts', () => {
        expect(element).not.toContainElement('ul');
      });
    });
  });

  describe('when discountRowsAppearance options is none', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-totals-discount
          .options=${{ discountRowsAppearance: DiscountRowsAppearance.None }}
        ></oryx-cart-totals-discount>`
      );
    });

    it('should render heading with correct amount of discounts', () => {
      const heading = element.renderRoot.querySelector('span');

      expect(heading?.textContent).toContain(
        `${mockNormalizedCartTotals.discounts?.length} discounts`
      );
    });

    it('should populate the data to the price component', () => {
      const priceComponent =
        element.renderRoot.querySelector<PriceComponent>('oryx-site-price');
      expect(priceComponent?.value).toBe(
        -mockNormalizedCartTotals.discountTotal!
      );
      expect(priceComponent?.currency).toBe(mockNormalizedCartTotals.currency);
    });

    it('should not render the discounts', () => {
      expect(element).not.toContainElement('ul');
    });
  });

  describe('when there are no totals', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement(
        'span, oryx-site-price, oryx-collapsible'
      );
    });
  });

  describe('when there are no discounts', () => {
    beforeEach(async () => {
      service.get = vi
        .fn()
        .mockReturnValue(
          of({ ...mockNormalizedCartTotals, discounts: undefined })
        );
      element = await fixture(
        html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('oryx-collapsible');
    });
  });

  describe('when there are no discountTotal', () => {
    beforeEach(async () => {
      service.get = vi
        .fn()
        .mockReturnValue(
          of({ ...mockNormalizedCartTotals, discountTotal: undefined })
        );
      element = await fixture(
        html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('oryx-collapsible');
    });
  });
});
