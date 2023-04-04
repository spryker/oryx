import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { of } from 'rxjs';
import { CustomerNoteComponent } from './customer-note.component';
import { customerNoteComponent } from './customer-note.def';

const mockedPickingList = {
  id: 'test',
  cartNote: 'test note',
};

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockedPickingList]));
  startPicking = vi.fn().mockReturnValue(of(mockedPickingList));
}

describe('CustomerNoteComponent', () => {
  let element: CustomerNoteComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(customerNoteComponent);
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
    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
    element = await fixture(
      html`<oryx-customer-note pickingListId="test"></oryx-customer-note>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render customer note', () => {
    const customerNote = element.renderRoot.querySelector('p');
    expect(customerNote?.textContent).toContain(mockedPickingList.cartNote);
  });

  describe('when picking is proceed', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('button')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should start picking with current picking list', () => {
      expect(service.startPicking).toHaveBeenCalledWith(mockedPickingList);
    });

    it('should navigate by route with picking list id', () => {
      expect(routerService.navigate).toHaveBeenCalledWith(
        expect.stringContaining(mockedPickingList.id)
      );
    });
  });
});
