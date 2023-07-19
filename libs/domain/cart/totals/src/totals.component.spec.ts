import { fixture } from '@open-wc/testing-helpers';
import { cartTotalsComponent, TotalsService } from '@spryker-oryx/cart';
import { mockNormalizedCartTotals } from '@spryker-oryx/cart/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { CartTotalsComponent } from './totals.component';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

class MockTotalService implements TotalsService {
  get = vi.fn().mockReturnValue(of(mockNormalizedCartTotals));
}

describe('CartTotalsComponent', () => {
  let element: CartTotalsComponent;
  let service: MockTotalService;

  beforeAll(async () => await useComponent([cartTotalsComponent]));

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

    element = await fixture(html`<oryx-cart-totals></oryx-cart-totals>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(CartTotalsComponent);
  });

  it('should render the content', () => {
    expect(element).toContainElement('h2');
    expect(element).toContainElement('oryx-composition');
  });

  describe('when there are no totals', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(html`<oryx-cart-totals></oryx-cart-totals>`);
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('h2, oryx-composition');
    });
  });
});
