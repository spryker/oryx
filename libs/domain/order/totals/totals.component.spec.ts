import { fixture } from '@open-wc/testing-helpers';
import { TotalsService } from '@spryker-oryx/cart';
import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { OrderTotalsComponent } from './totals.component';
import { orderTotalsComponent } from './totals.def';

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of());
  provide = vi.fn();
}

class MockTotalsService implements Partial<TotalsService> {
  get = vi.fn();
}

describe('OrderTotalsComponent', () => {
  let element: OrderTotalsComponent;
  let contextService: MockContextService;
  let totalsService: MockTotalsService;

  beforeAll(async () => {
    await useComponent([orderTotalsComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        { provide: ContextService, useClass: MockContextService },
        { provide: TotalsService, useClass: MockTotalsService },
      ],
    });

    totalsService = testInjector.inject<MockTotalsService>(TotalsService);
    contextService = testInjector.inject<MockContextService>(ContextService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-order-totals></oryx-order-totals>`);
    });

    it('is defined', async () => {
      expect(element).toBeInstanceOf(OrderTotalsComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are no orders totals', () => {
    beforeEach(async () => {
      totalsService.get.mockReturnValue(of(null));
      element = await fixture(html`<oryx-order-totals></oryx-order-totals>`);
    });

    it('should not render the totals', () => {
      expect(element).not.toContainElement('h2');
    });
  });

  describe('when there are orders totals', () => {
    beforeEach(async () => {
      contextService.get.mockReturnValue(of('123'));
      totalsService.get.mockReturnValue(of({}));
      element = await fixture(html`<oryx-order-totals></oryx-order-totals>`);
    });

    it('should not render the order totals heading', () => {
      expect(element).toContainElement('h2');
    });
  });
});
