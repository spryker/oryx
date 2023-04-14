import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { TabComponent } from '@spryker-oryx/ui/tab';
import { tabsComponent } from '@spryker-oryx/ui/tabs';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockPickingListData } from '../../mocks';
import { PickingComponent } from './picking.component';
import { pickingComponent } from './picking.def';

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  finishPicking = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

Element.prototype.scrollIntoView = vi.fn();

describe('PickingComponent', () => {
  let element: PickingComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent([pickingComponent, tabsComponent]);
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

    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    element = await fixture(
      html`<oryx-picking pickingListId="id"></oryx-picking>`
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

    expect(element).toContainElement(
      '#tab-not_picked[slot="panels"] oryx-picking-product-card'
    );
  });

  describe('when tab is selected', () => {
    it('should update chip appearance', () => {
      const tab = element.renderRoot.querySelectorAll(
        'oryx-tab'
      )[1] as TabComponent;
      tab.click();
      expect(
        tab.querySelector('oryx-chip[appearance="success"]')
      ).not.toBeFalsy();
    });
  });

  describe('when there is no picking list', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([]));

      element = await fixture(
        html`<oryx-picking pickingListId="id"></oryx-picking>`
      );
    });

    it('should not render product card', () => {
      expect(element).not.toContainElement('oryx-picking-product-card');
    });
  });

  describe('when all items are already picked', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([mockPickingListData[1]]));
      service.finishPicking = vi
        .fn()
        .mockReturnValue(of(mockPickingListData[1]));

      element = await fixture(
        html`<oryx-picking pickingListId="id"></oryx-picking>`
      );
    });

    it('should render finish button', () => {
      expect(
        element.renderRoot.querySelector('.submit-wrapper button')?.textContent
      ).toContain(i18n('picking.finish-picking'));
    });

    it('should render success message', () => {
      expect(
        element.renderRoot.querySelector('.picking-complete p')?.textContent
      ).toContain(i18n('picking.all-items-are-processed'));
    });

    it('should perform redirect after click', () => {
      const button = element.renderRoot.querySelector(
        '.submit-wrapper button'
      ) as HTMLButtonElement;
      button.click();

      expect(service.finishPicking).toHaveBeenCalled();
      expect(routerService.navigate).toHaveBeenCalledWith(`/`);
    });
  });
});
