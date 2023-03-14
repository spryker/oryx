import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { PickingComponent } from './picking.component';
import { pickingComponent } from './picking.def';

const mockPickingList = {
  id: 1,
  status: 'ready-for-picking',
  items: [
    {
      numberOfPicked: 0,
      numberOfNotPicked: 0,
      quantity: 5,
      productId: 'product-1',
      product: {
        id: 'product-1',
        productName: 'Mock Product 1',
        sku: 'sku-1',
        image: null,
        imageLarge: null,
      },
    },
    {
      numberOfPicked: 0,
      numberOfNotPicked: 0,
      quantity: 3,
      productId: 'product-2',
      product: {
        id: 'product-2',
        sku: 'sku-2',
        productName: 'Mock Product 2',
        image: null,
        imageLarge: null,
      },
    },
  ],
  cartNote: 'Note',
  createdAt: new Date(),
  updatedAt: new Date(),
};

class MockPickingListService implements Partial<PickingListService> {
  getById = vi.fn().mockReturnValue(of(mockPickingList));
}

describe('PickingComponent', () => {
  let element: PickingComponent;
  let service: MockPickingListService;

  beforeAll(async () => {
    await useComponent(pickingComponent);
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

    element = await fixture(html`<oryx-picking></oryx-picking>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render tabs', () => {
    expect(element.renderRoot.querySelector('oryx-tabs')).not.toBeFalsy();
    expect(element.renderRoot.querySelectorAll('oryx-tab').length).toBe(3);
  });

  it('should render tab contents', () => {
    expect(element.renderRoot.querySelectorAll('[slot="panels"]').length).toBe(
      3
    );

    expect(
      element.renderRoot.querySelector(
        '#tab-not_picked[slot="panels"] oryx-picking-product-card'
      )
    ).not.toBeFalsy();
  });

  describe('when there is no picking list', () => {
    beforeEach(async () => {
      service.getById.mockReturnValue(of(null));

      element = await fixture(html`<oryx-picking></oryx-picking>`);
    });

    it('should not render product card', () => {
      expect(
        element.renderRoot.querySelector('oryx-picking-product-card')
      ).toBeFalsy();
    });

    it('should render fallback', () => {
      expect(
        element.renderRoot.querySelector('[slot="panels"] p')?.textContent
      ).toBe(i18n('picking.no-picking-items-found'));
    });
  });
});
