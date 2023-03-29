import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockPickingListData } from '../../mocks';
import { PickingComponent } from './picking.component';
import { pickingComponent } from './picking.def';

class MockPickingListService implements Partial<PickingListService> {
  getById = vi.fn().mockReturnValue(of(mockPickingListData[0]));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
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
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;

    element = await fixture(
      html`<oryx-picking
        .pickingListId=${mockPickingListData[0].id}
      ></oryx-picking>`
    );
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

      element = await fixture(
        html`<oryx-picking
          .pickingListId=${mockPickingListData[0].id}
        ></oryx-picking>`
      );
    });

    it('should not render product card', () => {
      expect(
        element.renderRoot.querySelector('oryx-picking-product-card')
      ).toBeFalsy();
    });
  });

  describe('when all items are already picked', () => {
    beforeEach(async () => {
      service.getById.mockReturnValue(of(mockPickingListData[1]));

      element = await fixture(
        html`<oryx-picking
          .pickingListId=${mockPickingListData[1].id}
        ></oryx-picking>`
      );
    });

    it('should render success message', () => {
      expect(
        element.renderRoot
          .querySelector('.submit-wrapper button')
          ?.textContent?.trim()
      ).toBe(i18n('picking.finish-picking'));
    });
  });
});
