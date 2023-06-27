import { fixture } from '@open-wc/testing-helpers';
import * as cart from '@spryker-oryx/cart';
import { cartTotalsComponent } from '@spryker-oryx/cart';
import { mockNormalizedCartTotals } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { CartTotalsComponent } from './totals.component';

const mockController = () => ({
  getTotals: vi.fn().mockReturnValue(of(mockNormalizedCartTotals)),
  provideContext: vi.fn(),
});

describe('CartTotalsComponent', () => {
  let element: CartTotalsComponent;
  const callback = vi.fn();

  beforeAll(async () => await useComponent([cartTotalsComponent]));

  beforeEach(async () => {
    vi.spyOn(cart, 'TotalsController') as SpyInstance;
    (cart.TotalsController as unknown as SpyInstance).mockReturnValue(
      mockController
    );

    element = await fixture(
      html`<oryx-cart-totals
        .options=${{ reference: 'CART' }}
      ></oryx-cart-totals>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsComponent);
  });

  it('should render the content', () => {
    expect(element).toContainElement('h2');
    expect(element).toContainElement('oryx-composition');
  });

  it('should provide the default context', () => {
    expect(callback).toHaveBeenCalledWith('CART');
  });

  describe('when there are not totals', () => {
    beforeEach(async () => {
      vi.spyOn(cart, 'TotalsController') as SpyInstance;
      (cart.TotalsController as unknown as SpyInstance).mockReturnValue(
        mockController
      );

      element = await fixture(html`<oryx-cart-totals></oryx-cart-totals>`);
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('h2, oryx-composition');
    });
  });
});
