import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { destroyInjector } from '@spryker-oryx/di';
import {
  ItemsFilters,
  PickingListItem,
  pickingProductCardComponent,
} from '@spryker-oryx/picking';
import { html } from 'lit';
import { mockPickingListData } from '../../mocks';
import { PickingProductCardComponent } from './picking-product-card.component';

describe.only('PickingProductCardComponent', () => {
  let element: PickingProductCardComponent;
  const productItem: PickingListItem = mockPickingListData[0].items[0];

  beforeAll(async () => {
    await useComponent(pickingProductCardComponent);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when a product provided with status not picked', () => {
    beforeEach(async () => {
      element = await fixture(
        html`
          <oryx-picking-product-card
            .productItem="${productItem}"
            status="${ItemsFilters.NotPicked}"
          ></oryx-picking-product-card>
        `
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render name and sku', () => {
      expect(
        element.renderRoot
          .querySelector("[slot='heading']")
          ?.textContent?.trim()
      ).toBe(productItem.orderItem.name);

      expect(element.renderRoot.querySelector('h4')?.textContent?.trim()).toBe(
        productItem.orderItem.sku
      );
    });

    it('should not render oryx-image with the image-fade class when status is not NotFound', () => {
      expect(
        element.renderRoot
          .querySelector('oryx-image')
          ?.classList.value.includes('image-fade')
      ).toBe(false);
    });
  });
});
