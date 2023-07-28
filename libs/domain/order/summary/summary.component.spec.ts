import { fixture } from '@open-wc/testing-helpers';
import { mockAuthProviders } from '@spryker-oryx/auth/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  MockOrderService,
  mockOrderProviders,
} from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderService } from '../src/services';
import { OrderSummaryComponent } from './summary.component';
import { orderSummaryComponent } from './summary.def';

const partialOrder = {
  ...MockOrderService.mockOrder,
  id: '',
  createdAt: '',
};

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockid')),
  provide: vi.fn(),
};

const mockObserve = {
  get: vi.fn(),
};

const setupControllerSpies = (): void => {
  vi.spyOn(core, 'ContextController') as SpyInstance;
  (core.ContextController as unknown as SpyInstance).mockReturnValue(
    mockContext
  );

  vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
  (litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
    mockObserve
  );
};

class MockLocaleService implements Partial<LocaleService> {
  formatDateTime = vi.fn().mockReturnValue(of('mockdate'));
}

describe('OrderSummaryComponent', () => {
  let element: OrderSummaryComponent;
  let orderService: MockOrderService;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent([orderSummaryComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        ...mockOrderProviders,
        ...mockAuthProviders,
        { provide: LocaleService, useClass: MockLocaleService },
      ],
    });

    orderService = testInjector.inject(
      OrderService
    ) as unknown as MockOrderService;
    localeService = testInjector.inject(
      LocaleService
    ) as unknown as MockLocaleService;

    setupControllerSpies();

    element = await fixture(html`<oryx-order-summary></oryx-order-summary>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(OrderSummaryComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render inner components', () => {
    expect(element).toContainElement('section');
    expect(element).toContainElement('oryx-heading');
  });

  it('should format the date', () => {
    expect(localeService.formatDateTime).toHaveBeenCalledWith(
      MockOrderService.mockOrder.createdAt
    );
  });

  describe('when there is no order data', () => {
    beforeEach(async () => {
      orderService.get = vi.fn().mockReturnValue(of(null));
      orderService.getLastOrder = vi.fn().mockReturnValue(of(null));

      setupControllerSpies();

      element = await fixture(html`<oryx-order-summary></oryx-order-summary>`);
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('oryx-heading');
      expect(element).not.toContainElement('section');
    });
  });

  describe('when order contains partial details', () => {
    beforeEach(async () => {
      orderService.get = vi.fn().mockReturnValue(of(partialOrder));
      orderService.getLastOrder = vi.fn().mockReturnValue(of(partialOrder));

      setupControllerSpies();

      element = await fixture(html`<oryx-order-summary></oryx-order-summary>`);
    });

    it('should not format missed date', () => {
      expect(localeService.formatDateTime).toHaveBeenCalled();
    });

    it('should not render order id', () => {
      expect(element).not.toContainElement('oryx-icon + .title');
    });
  });

  describe('when print receipt button is clicked', () => {
    let windowPrint: () => void;

    beforeAll(() => {
      windowPrint = window.print;
      window.print = vi.fn();
    });

    afterAll(() => {
      window.print = windowPrint;
    });

    beforeEach(async () => {
      setupControllerSpies();

      element = await fixture(html`<oryx-order-summary></oryx-order-summary>`);
      element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
    });

    it('should print the receipt', () => {
      expect(window.print).toHaveBeenCalled();
    });
  });
});
