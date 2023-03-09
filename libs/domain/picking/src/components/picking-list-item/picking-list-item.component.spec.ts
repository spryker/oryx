import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  pickingListItemComponent,
  PickingListService,
} from '@spryker-oryx/picking';
import { html } from 'lit';
import { of } from 'rxjs';
import { PickingListItemComponent } from './picking-list-item.component';

class MockPickingListService implements Partial<PickingListService> {
  startPicking = vi.fn().mockReturnValue(of({}));
}

describe('PickingListCardComponent', () => {
  let element: PickingListItemComponent;

  beforeAll(async () => {
    await useComponent(pickingListItemComponent);
  });

  describe('when cart note is provided', () => {
    const pickingListProp = {
      id: 'pickingListId',
      status: 'not_started',
      items: [
        {
          quantity: 1,
          numberOfPicked: 0,
          numberOfNotPicked: 1,
          orderItem: {
            idSalesOrderItem: 123,
            uuid: 'orderItemUuid',
            name: 'name',
            sku: 'sku',
            quantity: 2,
            amount: '4',
          },
          product: {
            id: 'productId',
            sku: 'sku',
            productName: 'productName',
            image: null,
            imageLarge: null,
          },
        },
      ],
      cartNote: 'cartNote',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
          .pickingList=${pickingListProp}
        ></oryx-picking-list-item>`
      );
    });

    afterEach(() => {
      vi.clearAllMocks();
      destroyInjector();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render time', () => {
      const formattedTime = pickingListProp.createdAt
        .toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase();

      expect(
        element.renderRoot.querySelector('.time')?.textContent?.trim()
      ).toBe(formattedTime);
    });

    it('should render id', () => {
      expect(element.renderRoot.querySelector('.identifier')?.textContent).toBe(
        pickingListProp.id
      );
    });

    it('should render items number', () => {
      expect(
        element.renderRoot.querySelector('.total')?.textContent?.trim()
      ).toBe(`${pickingListProp.items.length} items`);
    });

    it('should emit showCustomerNote event when the customer note button is clicked', () => {
      const event = vi.fn();
      element.addEventListener('showCustomerNote', event);

      const button: HTMLButtonElement | null = element.renderRoot.querySelector(
        'oryx-icon-button > button'
      );
      button?.click();

      expect(event).toHaveBeenCalled();
    });
  });

  describe('when cart note is not provided', () => {
    const pickingListProp = {
      id: 'pickingListId',
      status: 'not_started',
      items: [
        {
          quantity: 1,
          numberOfPicked: 0,
          numberOfNotPicked: 1,
          orderItem: {
            idSalesOrderItem: 123,
            uuid: 'orderItemUuid',
            name: 'name',
            sku: 'sku',
            quantity: 2,
            amount: '4',
          },
          product: {
            id: 'productId',
            sku: 'sku',
            productName: 'productName',
            image: null,
            imageLarge: null,
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
          .pickingList=${pickingListProp}
        ></oryx-picking-list-item>`
      );
    });

    afterEach(() => {
      vi.clearAllMocks();
      destroyInjector();
    });

    it('should not render icon button', () => {
      expect(element.renderRoot.querySelector('oryx-icon-button')).toBe(null);
    });
  });
});
