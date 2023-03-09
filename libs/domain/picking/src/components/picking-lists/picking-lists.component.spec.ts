import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  pickingListsComponent,
  PickingListService,
} from '@spryker-oryx/picking';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeAll, beforeEach } from 'vitest';
import { PickingListsComponent } from './picking-lists.component';

describe('PickingListsComponent', () => {
  let element: PickingListsComponent;

  beforeAll(async () => {
    await useComponent(pickingListsComponent);
  });

  describe('when picking lists is not empty', () => {
    const mockPickingLists = [
      {
        id: 1,
        status: 'ready-for-picking',
        items: [],
        cartNote: 'Note',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        status: 'ready-for-picking',
        items: [],
        cartNote: 'Note',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    class MockPickingListService implements Partial<PickingListService> {
      get = vi.fn().mockReturnValue(of(mockPickingLists));
    }

    beforeEach(async () => {
      createInjector({
        providers: [
          {
            provide: PickingListService,
            useClass: MockPickingListService,
          },
        ],
      });

      afterEach(() => {
        vi.clearAllMocks();
        destroyInjector();
      });

      element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render ${mockPickingLists.length} picking lists`, () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-picking-list-item').length
      ).toBe(mockPickingLists.length);
    });

    it('should open and close customer note modal', async () => {
      const customerNoteText = 'Customer note';
      const pickingListCard = element.renderRoot.querySelector(
        'oryx-picking-list-item'
      );

      element.addEventListener('oryx.show-note', () => {
        const customerNoteModal = element.renderRoot.querySelector(
          'oryx-customer-note-modal'
        );
        expect(customerNoteModal?.getAttribute('note')).toBe(customerNoteText);

        customerNoteModal?.dispatchEvent(new CustomEvent('oryx.close'));
        expect(customerNoteModal?.getAttribute('note')).toBe(null);
      });

      pickingListCard?.dispatchEvent(
        new CustomEvent('oryx.show-note', {
          detail: { note: customerNoteText },
        })
      );
    });
  });

  describe('when picking lists list is empty', () => {
    class MockPickingListService implements Partial<PickingListService> {
      get = vi.fn().mockReturnValue(of([]));
    }

    beforeEach(async () => {
      createInjector({
        providers: [
          {
            provide: PickingListService,
            useClass: MockPickingListService,
          },
        ],
      });

      element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
    });

    afterEach(() => {
      vi.clearAllMocks();
      destroyInjector();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render fallback text`, () => {
      expect(element.renderRoot.querySelector('p')?.textContent).toBe(
        i18n('picking.no-picking-lists-found')
      );
    });
  });
});
