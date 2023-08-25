import { fixture } from '@open-wc/testing-helpers';
import { mockAuthProviders } from '@spryker-oryx/auth/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import * as experience from '@spryker-oryx/experience';
import { OrderService } from '@spryker-oryx/order';
import {
  MockOrderService,
  mockOrderProviders,
} from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderHeadingComponent } from './heading.component';
import { orderHeadingComponent } from './heading.def';

const options = { threshold: 2, limit: 5 };

const mockContent = (o: unknown = options) => ({
  getOptions: vi.fn().mockReturnValue(of(o)),
  getContent: vi.fn().mockReturnValue(of({})),
});

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockid')),
  provide: vi.fn(),
};

const mockObserve = {
  get: vi.fn(),
};

const setupControllerSpies = (options?: unknown): void => {
  vi.spyOn(experience, 'ContentController') as SpyInstance;
  (experience.ContentController as unknown as SpyInstance).mockReturnValue(
    mockContent(options)
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

describe('OrderHeadingComponent', () => {
  let element: OrderHeadingComponent;
  let orderService: MockOrderService;

  beforeAll(async () => {
    await useComponent(orderHeadingComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [...mockOrderProviders, ...mockAuthProviders],
    });

    orderService = testInjector.inject(
      OrderService
    ) as unknown as MockOrderService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when order data is available', () => {
    beforeEach(async () => {
      setupControllerSpies();

      element = await fixture(html`<oryx-order-heading></oryx-order-heading>`);
    });

    it('should be defined', () => {
      expect(element).toBeInstanceOf(OrderHeadingComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render its contents', () => {
      expect(element).toContainElement('oryx-heading');

      expect(element.renderRoot.querySelector('h3')?.innerText.trim()).toBe(
        '8 items'
      );
    });
  });

  describe('when there is no order data', () => {
    beforeEach(async () => {
      orderService.get = vi.fn().mockReturnValue(of(null));
      orderService.getLastOrder = vi.fn().mockReturnValue(of(null));

      setupControllerSpies();

      element = await fixture(html`<oryx-order-heading></oryx-order-heading>`);
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('oryx-heading');
    });
  });
});
