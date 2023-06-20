import { fixture } from '@open-wc/testing-helpers';
import { mockAuthProviders } from '@spryker-oryx/auth/mocks';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import * as experience from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { OrderService } from '@spryker-oryx/order';
import { MockOrderService, mockOrderProviders } from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderSummaryComponent } from './summary.component';
import { orderSummaryComponent } from './summary.def';

const mockContent = {
  getOptions: vi.fn().mockReturnValue(of({})),
  getContent: vi.fn().mockReturnValue(of({})),
};

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockid')),
  provide: vi.fn(),
};

const mockObserve = {
  get: vi.fn(),
};

const setupControllerSpies = (): void => {
  vi.spyOn(experience, 'ContentController') as SpyInstance;
  (experience.ContentController as unknown as SpyInstance).mockReturnValue(
    mockContent
  );

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

    orderService = testInjector.inject(orderService);
    localeService = testInjector.inject(LocaleService) as unknown as MockLocaleService;

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

  it('should format date', () => {
    expect(element).toContainElement('section');
    expect(element).toContainElement('oryx-heading');
  });

  describe('when there is no order data', () => {
    beforeEach(async () => {
      destroyInjector();

      class MockOrderService implements Partial<OrderService> {
        get = vi.fn().mockReturnValue(of(null));
        getLastOrder = vi.fn().mockReturnValue(of(null));
      }

      setupControllerSpies();

      createInjector({
        providers: [
          { provide: OrderService, useClass: MockOrderService },
          ...mockAuthProviders,
          { provide: LocaleService, useClass: MockLocaleService },
        ],
      });

      element = await fixture(html`<oryx-order-summary></oryx-order-summary>`);
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('oryx-heading');
    });
  });
});
