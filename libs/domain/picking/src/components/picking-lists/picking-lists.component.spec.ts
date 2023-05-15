import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { afterEach, beforeAll, beforeEach } from 'vitest';
import { mockPickingListData } from '../../mocks';
import { PickingListsComponent } from './picking-lists.component';
import { pickingListsComponent } from './picking-lists.def';
class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of(mockPickingListData));
}

describe('PickingListsComponent', () => {
  let element: PickingListsComponent;
  let service: MockPickingListService;

  beforeAll(async () => {
    await useComponent(pickingListsComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
      ],
    });

    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;
    element = await fixture(html`<oryx-picking-lists></oryx-picking-lists>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when picking lists is not empty', () => {
    const getCustomerNoteModal = (): ModalComponent | null =>
      element.renderRoot.querySelector('oryx-modal');

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render ${mockPickingListData.length} picking lists`, () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-picking-list-item').length
      ).toBe(mockPickingListData.length);
    });

    it('should open customer note modal', () => {
      const customerNoteText = 'Customer note';
      const pickingListCard = element.renderRoot.querySelector(
        'oryx-picking-list-item'
      );

      element.addEventListener('oryx.show-note', () => {
        const customerNoteModal = getCustomerNoteModal();
        expect(customerNoteModal?.hasAttribute('open')).toBe(true);
        expect(customerNoteModal?.textContent).contains(customerNoteText);
      });

      pickingListCard?.dispatchEvent(
        new CustomEvent('oryx.show-note', {
          detail: { note: customerNoteText },
        })
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

      it('should close modal when it emits oryx.close event', () => {
        element.addEventListener('oryx.show-note', () => {
          const customerNoteModal = getCustomerNoteModal();

          customerNoteModal?.dispatchEvent(new CustomEvent('oryx.close'));
          expect(customerNoteModal?.hasAttribute('open')).toBe(false);
          expect(customerNoteModal?.textContent).contains('');
        });
      });

      it('should close modal when close button is clicked', async () => {
        const customerNoteModal = getCustomerNoteModal();

        const closeButton: HTMLButtonElement | null =
          element.renderRoot.querySelector('oryx-modal button');
        closeButton?.click();

        await element.updateComplete;

        expect(customerNoteModal?.hasAttribute('open')).toBe(false);
      });
    });

    it('should open and close customer note modal', async () => {
      const customerNoteText = 'Customer note';
      const pickingListCard = element.renderRoot.querySelector(
        'oryx-picking-list-item'
      );

      element.addEventListener('oryx.show-note', () => {
        const customerNoteModal =
          element.renderRoot.querySelector('oryx-modal');
        expect(customerNoteModal?.hasAttribute('open')).toBe(true);
        expect(customerNoteModal?.textContent).contains(customerNoteText);

        customerNoteModal?.dispatchEvent(new CustomEvent('oryx.close'));
        expect(customerNoteModal?.hasAttribute('open')).toBe(false);
      });

      pickingListCard?.dispatchEvent(
        new CustomEvent('oryx.show-note', {
          detail: { note: customerNoteText },
        })
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
  });
});
