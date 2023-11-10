import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingHeaderService } from '@spryker-oryx/picking';
import { PickingListService } from '@spryker-oryx/picking/api';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { RouterService } from '@spryker-oryx/router';
import { TabComponent } from '@spryker-oryx/ui/tab';
import { tabsComponent } from '@spryker-oryx/ui/tabs';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { PickingPickerComponent } from './picker.component';
import { pickingPickerComponent } from './picker.def';

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  finishPicking = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

class MockPickingHeaderService implements Partial<PickingHeaderService> {
  discard = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

Element.prototype.scrollIntoView = vi.fn();

describe('PickingPickerComponent', () => {
  let element: PickingPickerComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;
  let pickingHeaderService: MockPickingHeaderService;

  const getTabs = () =>
    element.renderRoot.querySelectorAll<TabComponent>('oryx-tab');

  const onTabs = (
    tabs: NodeListOf<TabComponent> | TabComponent[],
    cb: (content: HTMLElement | null) => void
  ) => {
    tabs.forEach((tab) => {
      const tabContent = element.renderRoot.querySelector<HTMLElement>(
        `#${tab.getAttribute('for')}`
      );
      cb(tabContent);
    });
  };

  beforeAll(async () => {
    await useComponent([pickingPickerComponent, tabsComponent]);
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
        {
          provide: PickingHeaderService,
          useClass: MockPickingHeaderService,
        },
      ],
    });

    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;

    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    pickingHeaderService = testInjector.inject(
      PickingHeaderService
    ) as unknown as MockPickingHeaderService;

    element = await fixture(
      html`<oryx-picking-picker pickingListId="id"></oryx-picking-picker>`
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
    expect(element.renderRoot.querySelector('oryx-tabs')).not.toBeNull();
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
      const tab = element.renderRoot.querySelectorAll<TabComponent>(
        'oryx-tab'
      )[1] as TabComponent;
      tab.click();
      expect(tab).toContainElement('oryx-chip[appearance="success"]');
    });
  });

  describe('when there is no picking lists', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([]));

      element = await fixture(
        html`<oryx-picking-picker pickingListId="id"></oryx-picking-picker>`
      );
    });

    it('should not render product card', () => {
      onTabs(getTabs(), (tabContent) =>
        expect(tabContent).not.toContainElement('oryx-picking-product-card')
      );
    });

    it('should show fallback text', () => {
      onTabs(getTabs(), (tabContent) =>
        expect(tabContent?.querySelector('section h2')?.textContent).toContain(
          i18n('picking.no-items')
        )
      );
    });

    it('should show fallback image', () => {
      onTabs(getTabs(), (tabContent) =>
        expect(tabContent).toContainElement('oryx-image[resource="no-orders"]')
      );
    });
  });

  describe('when all items are already picked', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([mockPickingListData[1]]));
      service.finishPicking = vi
        .fn()
        .mockReturnValue(of(mockPickingListData[1]));

      element = await fixture(
        html`<oryx-picking-picker pickingListId="id"></oryx-picking-picker>`
      );
    });

    it('should render finish button', () => {
      onTabs(getTabs(), (tabContent) =>
        expect(
          tabContent?.querySelector('.submit-wrapper oryx-button')
        ).toHaveProperty('text', i18n('picking.finish-picking'))
      );
    });

    it('should render success message on "Not Picked" and "NotFound" tabs', () => {
      onTabs([getTabs()[0], getTabs()[2]], (tabContent) => {
        expect(tabContent?.querySelector('section h1')?.textContent).toContain(
          i18n('picking.great-job')
        );

        expect(
          tabContent?.querySelector('section span')?.textContent
        ).toContain(i18n('picking.all-items-are-processed'));
      });
    });

    it('should render success image on "Not Picked" and "NotFound" tabs', () => {
      onTabs([getTabs()[0], getTabs()[2]], (tabContent) =>
        expect(tabContent).toContainElement(
          'oryx-image[resource="picking-items-processed"]'
        )
      );
    });

    it('should render list of picked products on "Picked" tab', () => {
      onTabs([getTabs()[1]], (tabContent) => {
        expect(tabContent).toContainElement('oryx-picking-product-card');
      });
    });

    it('should perform redirect after click', () => {
      element.renderRoot
        .querySelector<HTMLElement>('.submit-wrapper oryx-button')
        ?.click();

      expect(service.finishPicking).toHaveBeenCalled();
      expect(routerService.navigate).toHaveBeenCalledWith(`/`);
    });
  });

  describe('when picked all items but some of them are not found', () => {
    beforeEach(async () => {
      const partiallyPickedPickingList = {
        ...mockPickingListData[1],
        items: [
          {
            ...mockPickingListData[1].items[0],
            numberOfPicked: mockPickingListData[1].items[0].quantity - 1,
            numberOfNotPicked: 1,
          },
        ],
      };

      service.get = vi.fn().mockReturnValue(of([partiallyPickedPickingList]));
      service.finishPicking = vi
        .fn()
        .mockReturnValue(of(partiallyPickedPickingList));

      element = await fixture(
        html`<oryx-picking-picker pickingListId="id"></oryx-picking-picker>`
      );
    });

    it('should render finish button', () => {
      onTabs(getTabs(), (tabContent) =>
        expect(
          tabContent?.querySelector('.submit-wrapper oryx-button')
        ).toHaveProperty('text', i18n('picking.finish-picking'))
      );
    });

    it('should render success message on "Not Picked" tab', () => {
      onTabs([getTabs()[0]], (tabContent) => {
        expect(tabContent?.querySelector('section h1')?.textContent).toContain(
          i18n('picking.great-job')
        );

        expect(
          tabContent?.querySelector('section span')?.textContent
        ).toContain(i18n('picking.all-items-are-processed'));
      });
    });

    it('should render success image on "Not Picked" tab', () => {
      onTabs([getTabs()[0]], (tabContent) =>
        expect(tabContent).toContainElement(
          'oryx-image[resource="picking-items-processed"]'
        )
      );
    });

    it('should render list of picked products on "Picked" and "NotFound" tabs', () => {
      onTabs([getTabs()[1], getTabs()[2]], (tabContent) =>
        expect(tabContent).toContainElement('oryx-picking-product-card')
      );
    });

    it('should perform redirect after click', () => {
      element.renderRoot
        .querySelector<HTMLButtonElement>('.submit-wrapper oryx-button')
        ?.click();

      expect(service.finishPicking).toHaveBeenCalled();
      expect(routerService.navigate).toHaveBeenCalledWith(`/`);
      expect(pickingHeaderService.discard).toHaveBeenCalled();
    });
  });
});
