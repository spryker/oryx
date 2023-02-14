import { fixture, oneEvent } from '@open-wc/testing-helpers';
import { mockAuthProviders } from '@spryker-oryx/auth/mocks';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import * as experience from '@spryker-oryx/experience';
import { OrderService } from '@spryker-oryx/order';
import {
  mockOrderProviders,
  MockOrderService,
  OrderItemCount,
} from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderEntriesComponent } from './entries.component';
import { orderEntriesComponent } from './entries.def';

const mockContent = {
  getOptions: vi.fn().mockReturnValue(of({ threshold: 3, limit: 5 })),
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

setupControllerSpies();

describe('OrderEntriesComponent', () => {
  let element: OrderEntriesComponent;
  let orderService: MockOrderService;

  const getButton = (): HTMLButtonElement => {
    return element.shadowRoot?.querySelector('button') as HTMLButtonElement;
  };

  const getItems = (): NodeList => {
    return element.shadowRoot?.querySelectorAll('cart-entry') as NodeList;
  };

  beforeAll(async () => {
    await useComponent([orderEntriesComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [...mockOrderProviders, ...mockAuthProviders],
    });
    orderService = testInjector.inject(
      OrderService
    ) as unknown as MockOrderService;
    element = await fixture(html`<oryx-order-entries></oryx-order-entries>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(OrderEntriesComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when order data is available', () => {
    it('should render its contents', () => {
      expect(element).toContainElement('cart-entry');
    });

    describe('when order items are above the threshold', () => {
      it('should render more products button', () => {
        expect(element).toContainElement('button');
        const button = getButton();
        expect(button.innerText).toContain('+3');
        expect(button.innerText).toContain('More');
      });

      it('should render items equal to limit', () => {
        const items = getItems();
        expect(items?.length).toBe(5);
      });

      describe('when more products button is clicked', () => {
        beforeEach(async () => {
          const button = getButton();
          setTimeout(() => {
            button.click();
          }, 0);

          await oneEvent(button, 'click');
        });
        it('should render all items', async () => {
          const items = getItems();
          expect(items?.length).toBe(8);
        });
        it('should update more products button text', () => {
          const button = getButton();
          expect(button.innerText).toContain('-3');
          expect(button.innerText).toContain('Less');
        });
      });

      describe('when less products button is clicked', () => {
        beforeEach(async () => {
          let button = getButton();
          setTimeout(() => {
            button.click();
          }, 0);

          await oneEvent(button, 'click');
          button = getButton();
          setTimeout(() => {
            button.click();
          }, 0);

          await oneEvent(button, 'click');
        });

        it('should render all items', async () => {
          const items = getItems();
          expect(items?.length).toBe(5);
        });

        it('should update more products button text', () => {
          const button = getButton();
          expect(button.innerText).toContain('+3');
          expect(button.innerText).toContain('More');
        });
      });
    });

    describe('when order items are under threshold', () => {
      beforeEach(async () => {
        orderService.changeItemCount(OrderItemCount.UnderThreshold);
        element = await fixture(
          html`<oryx-order-entries></oryx-order-entries>`
        );
      });

      it('should render all items', () => {
        const items = getItems();

        expect(items?.length).toBe(3);
      });

      it('should not render more products button', () => {
        expect(element).not.toContainElement('button');
      });
    });
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
        ],
      });

      element = await fixture(html`<oryx-order-entries></oryx-order-entries>`);
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('cart-entry');
    });
  });
});
