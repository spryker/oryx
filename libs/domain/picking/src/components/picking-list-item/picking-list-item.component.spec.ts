import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of, throwError } from 'rxjs';
import { afterEach } from 'vitest';
import { mockPickingListData } from '../../mocks';
import { PickingListError } from '../../models';
import { PickingListService } from '../../services';
import { PickingListItemComponent } from './picking-list-item.component';
import { pickingListItemComponent } from './picking-list-item.def';
class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  startPicking = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

class MockLocaleService implements Partial<LocaleService> {
  formatTime = vi.fn().mockReturnValue(of('01:23'));
}

describe('PickingListItemComponent', () => {
  let element: PickingListItemComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent(pickingListItemComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
      ],
    });
    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
    localeService = testInjector.inject(
      LocaleService
    ) as unknown as MockLocaleService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when cart note is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-picking-list-item
          pickingListId="id"
        ></oryx-picking-list-item>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should perform time formatting', () => {
      expect(localeService.formatTime).toHaveBeenCalledWith(
        mockPickingListData[0].requestedDeliveryDate
      );
    });

    it('should render time', () => {
      expect(element.renderRoot.querySelector('h3')?.textContent?.trim()).toBe(
        '01:23'
      );
    });

    it('should render order reference as id', () => {
      expect(element.renderRoot.querySelector('.identifier')?.textContent).toBe(
        mockPickingListData[0].orderReferences[0]
      );
    });

    it('should render items number', () => {
      expect(
        element.renderRoot.querySelector('.total')?.textContent?.trim()
      ).toBe(
        i18n('picking.picking-list-item.<count>-items', {
          count: mockPickingListData[0].itemsCount,
        })
      );
    });

    it('should emit showCustomerNote event when the customer note button is clicked', () => {
      const event = vi.fn();
      element.addEventListener('oryx.show-note', event);

      const button: HTMLButtonElement | null = element.renderRoot.querySelector(
        'oryx-icon-button > button'
      );
      button?.click();

      expect(event).toHaveBeenCalled();
    });

    describe('and picking is proceed', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-button button')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should perform redirect', () => {
        expect(routerService.navigate).toHaveBeenCalledWith(
          `/customer-note-info/${mockPickingListData[0].id}`
        );
      });
    });
  });

  describe('when cart note is not provided', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([mockPickingListData[1]]));
      service.startPicking = vi
        .fn()
        .mockReturnValue(of(mockPickingListData[1]));

      element = await fixture(
        html`<oryx-picking-list-item
          pickingListId="id"
        ></oryx-picking-list-item>`
      );
    });

    it('should not render icon button', () => {
      expect(element).not.toContainElement('oryx-icon-button');
    });

    describe('and picking is proceed', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-button button')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should start picking', () => {
        expect(service.startPicking).toHaveBeenCalledWith(
          mockPickingListData[1]
        );
      });

      it('should perform redirect', () => {
        expect(routerService.navigate).toHaveBeenCalledWith(
          `/picking-list/picking/${mockPickingListData[1].id}`
        );
      });

      describe('and picking is already in progress', () => {
        const event = vi.fn();
        beforeEach(async () => {
          routerService.navigate.mockClear();
          service.startPicking = vi.fn().mockReturnValue(
            throwError(() => {
              const error = new Error('mock') as PickingListError;
              error.status = 409;
              return error;
            })
          );

          element = await fixture(
            html`<oryx-picking-list-item
              pickingListId="id"
            ></oryx-picking-list-item>`
          );

          element.addEventListener('oryx.show-picking-in-progress', event);

          element.renderRoot
            .querySelector('oryx-button button')
            ?.dispatchEvent(new MouseEvent('click'));
        });

        it('should emit showPickingInProgress event', () => {
          expect(event).toHaveBeenCalled();
        });

        it('should not perform redirect', () => {
          expect(routerService.navigate).not.toHaveBeenCalled();
        });
      });
    });
  });
});
