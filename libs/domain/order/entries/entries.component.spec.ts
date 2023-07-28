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
import { OrderEntriesComponent } from './entries.component';
import { orderEntriesComponent } from './entries.def';
import { OrderEntriesOptions } from './entries.model';

const options = { threshold: 2, limit: 5 };

const mockContent = (o: OrderEntriesOptions = options) => ({
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

const setupControllerSpies = (options?: OrderEntriesOptions): void => {
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

describe('OrderEntriesComponent', () => {
  let element: OrderEntriesComponent;
  let orderService: MockOrderService;

  const getButton = (): HTMLElement => {
    return element.shadowRoot?.querySelector('oryx-button') as HTMLElement;
  };

  const getItems = (): NodeList => {
    return element.shadowRoot?.querySelectorAll('oryx-cart-entry') as NodeList;
  };

  beforeAll(async () => {
    await useComponent(orderEntriesComponent);
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
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when order data is available', () => {
    beforeEach(async () => {
      setupControllerSpies();

      element = await fixture(html`<oryx-order-entries></oryx-order-entries>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render its contents', () => {
      expect(element).toContainElement(
        'oryx-heading, oryx-cart-entry, oryx-button'
      );
    });

    describe('and order items are above the threshold', () => {
      it('should render toggle button with proper title', () => {
        const button = getButton();
        expect(button).toHaveProperty('text', 'More than 3');
      });

      it('should render items equal to limit', () => {
        expect(getItems()?.length).toBe(5);
      });

      describe('and toggle button is clicked', () => {
        beforeEach(() => {
          getButton().dispatchEvent(new MouseEvent('click'));
        });
        it('should render all items', () => {
          expect(getItems()?.length).toBe(8);
        });
        it('should render toggle button with proper title', () => {
          const button = getButton();
          expect(button).toHaveProperty('text', 'Less than 3');
        });
      });
    });

    describe('and order items are under threshold', () => {
      beforeEach(async () => {
        setupControllerSpies({ limit: 5, threshold: 5 });

        element = await fixture(
          html`<oryx-order-entries></oryx-order-entries>`
        );
      });

      it('should render all items', () => {
        expect(getItems()?.length).toBe(8);
      });

      it('should not render more products button', () => {
        expect(element).not.toContainElement('oryx-button');
      });
    });

    describe('and amount of entries to show is not limited', () => {
      beforeEach(async () => {
        setupControllerSpies({ limit: 0, threshold: 3 });

        element = await fixture(
          html`<oryx-order-entries></oryx-order-entries>`
        );
      });

      it('should not render the button', () => {
        expect(element).not.toContainElement('oryx-button');
      });
    });
  });

  describe('when there is no order data', () => {
    beforeEach(async () => {
      orderService.get = vi.fn().mockReturnValue(of(null));
      orderService.getLastOrder = vi.fn().mockReturnValue(of(null));

      setupControllerSpies();

      element = await fixture(html`<oryx-order-entries></oryx-order-entries>`);
    });

    it('should not render content', () => {
      expect(element).not.toContainElement(
        'oryx-heading, oryx-cart-entry, oryx-button'
      );
    });
  });
});
