import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  pickingListsComponent,
  PickingListService,
} from '@spryker-oryx/picking';
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
        element.renderRoot.querySelectorAll('oryx-picking-list-card').length
      ).toBe(mockPickingLists.length);
    });

    it('should open and close customer note modal', async () => {
      const customerNoteText = 'Customer note';
      const pickingListCard = element.renderRoot.querySelector(
        'oryx-picking-list-card'
      );

      element.addEventListener('showCustomerNote', () => {
        const customerNoteModal = element.renderRoot.querySelector(
          'oryx-customer-note-modal'
        );
        expect(customerNoteModal?.getAttribute('customerNote')).toBe(
          customerNoteText
        );

        customerNoteModal?.dispatchEvent(new Event('close'));
        expect(customerNoteModal?.getAttribute('customerNote')).toBe(null);
      });

      pickingListCard?.dispatchEvent(
        new CustomEvent('showCustomerNote', {
          detail: { customerNote: customerNoteText },
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
        'No picking lists found!'
      );
    });
  });
});
