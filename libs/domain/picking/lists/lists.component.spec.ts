import { fixture } from '@open-wc/testing-helpers';
import { App, AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { PickingCustomerNoteModalComponent } from '@spryker-oryx/picking/customer-note-modal';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { PickingSyncActionHandlerService } from '@spryker-oryx/picking/offline';
import { CLOSE_EVENT, ModalComponent } from '@spryker-oryx/ui/modal';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { afterEach, beforeAll, beforeEach } from 'vitest';
import { PickingListsComponent } from './lists.component';
import { pickingListsComponent } from './lists.def';

const mockOfflineDataPlugin = {
  isRefreshing: vi.fn().mockReturnValue(of(false)),
};

class MockPickingSyncActionHandlerService
  implements Partial<PickingSyncActionHandlerService>
{
  isSyncing = vi.fn().mockReturnValue(of(false));
}

class MockApp implements Partial<App> {
  requirePlugin = vi.fn().mockReturnValue(mockOfflineDataPlugin);
}

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of(mockPickingListData));
  isRefreshing = vi.fn().mockReturnValue(of(false));
}

describe('ListsComponent', () => {
  let element: PickingListsComponent;
  let service: MockPickingListService;
  let syncService: MockPickingSyncActionHandlerService;

  beforeAll(async () => {
    await useComponent([pickingListsComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
        {
          provide: PickingSyncActionHandlerService,
          useClass: MockPickingSyncActionHandlerService,
        },
        {
          provide: AppRef,
          useClass: MockApp,
        },
      ],
    });

    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;
    syncService = testInjector.inject(
      PickingSyncActionHandlerService
    ) as unknown as MockPickingSyncActionHandlerService;
    element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when not retrieving data', () => {
    it('should not show loading indicator', () => {
      expect(element.renderRoot.querySelector('.loading')).toBeNull();
    });

    it('should not show sync indicator', () => {
      expect(element.renderRoot.querySelector('.sync')).toBeNull();
    });
  });

  describe('when retrieving data', () => {
    beforeEach(async () => {
      mockOfflineDataPlugin.isRefreshing.mockReturnValue(of(true));
      element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
    });

    it('should show loading indicator', () => {
      expect(element.renderRoot.querySelector('.loading')).not.toBeNull();
    });

    afterEach(() => {
      mockOfflineDataPlugin.isRefreshing.mockReturnValue(of(false));
    });
  });

  describe('when receiving push notifications', () => {
    beforeEach(async () => {
      syncService.isSyncing.mockReturnValue(of(true));
      element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
    });

    it('should show loading indicator', () => {
      expect(element.renderRoot.querySelector('.sync')).not.toBeNull();
    });
  });

  describe('when picking lists is not empty', () => {
    const getCustomerNoteModal = (): PickingCustomerNoteModalComponent | null =>
      element.renderRoot.querySelector('oryx-picking-customer-note-modal');

    const getPickingInProgressModal = (): ModalComponent | null =>
      element.renderRoot.querySelector(
        'oryx-picking-picking-in-progress-modal'
      );

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render ${mockPickingListData.length} picking lists`, () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-picking-list-item').length
      ).toBe(mockPickingListData.length);
    });

    it(`should render ${mockPickingListData.length} in filters counter`, () => {
      expect(
        element.renderRoot.querySelector('.filters span')?.textContent
      ).toContain(mockPickingListData.length);
    });

    it('should open picking in progress modal', () => {
      const pickingListCard = element.renderRoot.querySelector(
        'oryx-picking-list-item'
      );

      element.addEventListener('oryx.show-picking-in-progress', () => {
        const pickingInProgressModal = getPickingInProgressModal();
        expect(pickingInProgressModal?.open).toBe(true);
      });

      pickingListCard?.dispatchEvent(
        new CustomEvent('oryx.show-picking-in-progress')
      );
    });

    describe('when customer note modal is opened', () => {
      const customerNoteText = 'Customer note';

      beforeEach(() => {
        const pickingListCard = element.renderRoot.querySelector(
          'oryx-picking-list-item'
        );

        pickingListCard?.dispatchEvent(
          new CustomEvent('oryx.show-note', {
            detail: { note: customerNoteText },
          })
        );
      });

      it('should show customer note modal', () => {
        element.addEventListener('oryx.show-note', () => {
          expect(getCustomerNoteModal()?.open).toBe(true);
        });
      });

      it(`should close modal when it emits ${CLOSE_EVENT} event`, () => {
        element.addEventListener('oryx.show-note', () => {
          getCustomerNoteModal()?.dispatchEvent(new CustomEvent(CLOSE_EVENT));
          expect(getCustomerNoteModal()?.hasAttribute('open')).toBe(false);
        });
      });
    });

    it('should open and close picking in progress modal', async () => {
      const pickingListCard = element.renderRoot.querySelector(
        'oryx-picking-list-item'
      );

      element.addEventListener('oryx.show-picking-in-progress', () => {
        const pickingInProgressModal = getPickingInProgressModal();
        expect(pickingInProgressModal?.hasAttribute('open')).toBe(true);

        pickingInProgressModal?.dispatchEvent(new CustomEvent('oryx.close'));
        expect(pickingInProgressModal?.hasAttribute('open')).toBe(false);
      });

      pickingListCard?.dispatchEvent(
        new CustomEvent('oryx.show-picking-in-progress')
      );
    });
  });

  describe('when picking lists list is empty', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([]));
      element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render fallback text`, () => {
      expect(
        element.renderRoot.querySelector('oryx-heading')?.textContent?.trim()
      ).toBe(i18n('picking.no-results-found'));
    });

    it(`should render 0 in filters counter`, () => {
      expect(
        element.renderRoot.querySelector('.filters span')?.textContent
      ).toContain('0');
    });
  });

  describe('when the list is not provided', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(null));
      element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
    });

    it(`should render fallback text`, () => {
      expect(
        element.renderRoot.querySelector('oryx-heading')?.textContent?.trim()
      ).toBe(i18n('picking.no-results-found'));
    });

    it(`should render 0 in filters counter`, () => {
      expect(
        element.renderRoot.querySelector('.filters span')?.textContent
      ).toContain('0');
    });
  });

  describe('when start searching', () => {
    beforeEach(async () => {
      const pickingListHeader = element.renderRoot.querySelector(
        'oryx-picking-lists-header'
      );

      pickingListHeader?.dispatchEvent(
        new CustomEvent('oryx.search', {
          detail: { search: '', open: true },
        })
      );
    });

    it('should render a fallback', () => {
      expect(
        element.renderRoot.querySelector('.no-items-fallback')
      ).not.toBeNull();

      expect(
        element.renderRoot.querySelector('.no-items-fallback oryx-heading')
          ?.textContent
      ).toContain(i18n('picking-lists.search-by-order-ID'));

      expect(
        element.renderRoot
          .querySelector('.no-items-fallback oryx-image')
          ?.getAttribute('resource')
      ).toBe('searching');
    });
  });

  describe('when there is no results while searching', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([]));
      const pickingListHeader = element.renderRoot.querySelector(
        'oryx-picking-lists-header'
      );

      pickingListHeader?.dispatchEvent(
        new CustomEvent('oryx.search', {
          detail: { search: 'ddd', open: true },
        })
      );
    });

    it('should render a fallback', () => {
      expect(
        element.renderRoot.querySelector('.no-items-fallback')
      ).not.toBeNull();

      expect(
        element.renderRoot.querySelector('.no-items-fallback oryx-heading')
          ?.textContent
      ).toContain(i18n('picking-lists.no-picking-results'));

      expect(
        element.renderRoot
          .querySelector('.no-items-fallback oryx-image')
          ?.getAttribute('resource')
      ).toBe('no-search-results');
    });
  });
});
