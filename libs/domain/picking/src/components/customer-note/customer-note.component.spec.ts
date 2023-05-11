import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListError, PickingListService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { of, throwError } from 'rxjs';
import { mockPickingListData } from '../../mocks';
import { pickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.def';
import { CustomerNoteComponent } from './customer-note.component';
import { customerNoteComponent } from './customer-note.def';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  startPicking = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

describe('CustomerNoteComponent', () => {
  let element: CustomerNoteComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent([
      customerNoteComponent,
      pickingInProgressModalComponent,
    ]);
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
      html`<oryx-customer-note pickingListId="id"></oryx-customer-note>`
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
    expect(customerNote?.textContent).toContain(
      mockPickingListData[0].cartNote
    );
  });

  describe('when picking is proceed', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('button')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should start picking with current picking list', () => {
      expect(service.startPicking).toHaveBeenCalledWith(mockPickingListData[0]);
    });

    it('should navigate by route with picking list id', () => {
      expect(routerService.navigate).toHaveBeenCalledWith(
        expect.stringContaining(mockPickingListData[0].id)
      );
    });

    describe('and picking is already in progress', () => {
      beforeEach(async () => {
        routerService.navigate.mockClear();
        service.startPicking = vi.fn().mockReturnValue(
          throwError(() => {
            const error = new Error('mock') as PickingListError;
            error.status = 409;
            return error;
          })
        );

        element = await fixture(
          html`<oryx-customer-note pickingListId="id"></oryx-customer-note>`
        );

        element.renderRoot
          .querySelector('button')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should not navigate route', () => {
        expect(routerService.navigate).not.toHaveBeenCalled();
      });

      it('should open picking in progress modal', () => {
        expect(
          element.renderRoot
            .querySelector('oryx-picking-in-progress-modal')
            ?.shadowRoot?.querySelector('oryx-modal')
            ?.hasAttribute('open')
        ).toBe(true);
      });
    });
  });
});
