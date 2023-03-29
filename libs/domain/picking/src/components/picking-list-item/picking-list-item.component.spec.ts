import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  pickingListItemComponent,
  PickingListService,
} from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { afterEach } from 'vitest';
import { mockPickingListData } from '../../mocks';
import { PickingListItemComponent } from './picking-list-item.component';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockPickingListService implements Partial<PickingListService> {
  getById = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  startPicking = vi.fn().mockReturnValue(of(mockPickingListData[0]));
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
          pickingListId="withCartNote"
        ></oryx-picking-list-item>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should perform time formatting', () => {
      expect(localeService.formatTime).toHaveBeenCalledWith(
        mockPickingListData[0].createdAt
      );
    });

    it('should render time', () => {
      expect(
        element.renderRoot
          .querySelector("[slot='heading'] span")
          ?.textContent?.trim()
      ).toBe('01:23');
    });

    it('should render id', () => {
      expect(element.renderRoot.querySelector('h4')?.textContent).toBe(
        mockPickingListData[0].id
      );
    });

    it('should render items number', () => {
      expect(
        element.renderRoot.querySelector('.total')?.textContent?.trim()
      ).toBe(
        i18n('picking.picking-list-item.<count>-items', {
          count: mockPickingListData[0].items.length,
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
      service.getById = vi.fn().mockReturnValue(of(mockPickingListData[1]));
      service.startPicking = vi
        .fn()
        .mockReturnValue(of(mockPickingListData[1]));

      element = await fixture(
        html`<oryx-picking-list-item
          pickingListId="withoutCartNote"
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
    });
  });
});
