import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  pickingListItemComponent,
  PickingListService,
} from '@spryker-oryx/picking';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { afterEach } from 'vitest';
import { mockPickingListData } from '../../mocks';
import { PickingListItemComponent } from './picking-list-item.component';

describe('PickingListCardComponent', () => {
  let element: PickingListItemComponent;

  class MockPickingListService implements Partial<PickingListService> {
    getById = vi.fn((pickingListId: string) => {
      return of(
        mockPickingListData.find(({ id }) => id === pickingListId) ?? null
      );
    });
    startPicking = vi.fn();
  }

  beforeAll(async () => {
    await useComponent(pickingListItemComponent);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when cart note is provided', () => {
    const pickingList = mockPickingListData.find(({ cartNote }) => cartNote)!;

    beforeEach(async () => {
      createInjector({
        providers: [
          {
            provide: PickingListService,
            useClass: MockPickingListService,
          },
        ],
      });

      element = await fixture(
        html`<oryx-picking-list-item
          .pickingListId=${pickingList.id}
        ></oryx-picking-list-item>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render time', () => {
      const formattedTime = pickingList.createdAt
        .toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase();

      expect(
        element.renderRoot
          .querySelector("[slot='heading'] span")
          ?.textContent?.trim()
      ).toBe(formattedTime);
    });

    it('should render id', () => {
      expect(element.renderRoot.querySelector('h4')?.textContent).toBe(
        pickingList.id
      );
    });

    it('should render items number', () => {
      expect(
        element.renderRoot.querySelector('.total')?.textContent?.trim()
      ).toBe(
        i18n('picking.picking-list-item.{count}-items', {
          count: pickingList.items.length,
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
  });

  describe('when cart note is not provided', () => {
    const pickingList = mockPickingListData.find(({ cartNote }) => !cartNote)!;

    beforeEach(async () => {
      createInjector({
        providers: [
          {
            provide: PickingListService,
            useClass: MockPickingListService,
          },
        ],
      });

      element = await fixture(
        html`<oryx-picking-list-item
          .pickingListId=${pickingList.id}
        ></oryx-picking-list-item>`
      );
    });

    it('should not render icon button', () => {
      expect(element.renderRoot.querySelector('oryx-icon-button')).toBe(null);
    });
  });
});
