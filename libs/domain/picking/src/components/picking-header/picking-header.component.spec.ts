import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockPickingListData } from '@spryker-oryx/picking/src/mocks';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { of } from 'rxjs';
import { PickingListService } from '../../services';
import { PickingHeaderComponent } from './picking-header.component';
import { pickingHeaderComponent } from './picking-header.def';

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
}

describe('PickingHeaderComponent', () => {
  let element: PickingHeaderComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(pickingHeaderComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-picking-header pickingListId="mockid"></oryx-picking-header>`
    );

    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;

    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  const getCustomerNote = () => {
    return element.renderRoot.querySelector(
      'oryx-icon-button button[aria-label="Customer note"]'
    );
  };

  const getBackButton = () => {
    return element.renderRoot.querySelector(
      'button[aria-label="Back to pick lists"]'
    );
  };

  it('is defined', () => {
    expect(element).toBeInstanceOf(PickingHeaderComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render back button', () => {
    expect(getBackButton()).not.toBeNull();
  });

  it('should render id', () => {
    expect(
      (element.renderRoot.querySelector('.title') as HTMLElement).innerText
    ).toContain('mockid');
  });

  it('should render customer note', () => {
    expect(getCustomerNote()).not.toBeNull();
  });

  it('should render account button', () => {
    expect(
      element.renderRoot.querySelector('oryx-picking-user-navigation-item')
    ).not.toBeNull();
  });

  describe('when picking list does not have customer note', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([mockPickingListData[1]]));

      element = await fixture(
        html`<oryx-picking-header pickingListId="mockid"></oryx-picking-header>`
      );
    });

    it('should not render customer note', () => {
      expect(getCustomerNote()).toBeNull();
    });
  });

  describe('when back button is clicked', () => {
    beforeEach(() => {
      (getBackButton() as HTMLButtonElement).click();
    });
    //TODO - check that modal is opened first
    it('should call router service', () => {
      expect(routerService.back).toHaveBeenCalled();
    });
  });
});
