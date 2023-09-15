import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingListError, PickingListService } from '@spryker-oryx/picking';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { RouterService } from '@spryker-oryx/router';
import { modalComponent } from '@spryker-oryx/ui/modal';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of, throwError } from 'rxjs';
import { PickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.component';
import { pickingInProgressModalComponent } from '../picking-in-progress/picking-in-progress.def';
import { PickingCustomerNoteComponent } from './customer-note.component';
import { pickingCustomerNoteComponent } from './customer-note.def';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  startPicking = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

describe('CustomerNoteComponent', () => {
  let element: PickingCustomerNoteComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;

  const getPickingInProgressModal = () => {
    return element.renderRoot.querySelector(
      'oryx-picking-in-progress-modal'
    ) as PickingInProgressModalComponent;
  };

  beforeAll(async () => {
    await useComponent([
      pickingCustomerNoteComponent,
      pickingInProgressModalComponent,
      modalComponent,
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
      html`<oryx-picking-customer-note
        pickingListId="id"
      ></oryx-picking-customer-note>`
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
      element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
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
          html`<oryx-picking-customer-note
            pickingListId="id"
          ></oryx-picking-customer-note>`
        );

        element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
      });

      it('should not navigate route', () => {
        expect(routerService.navigate).not.toHaveBeenCalledWith(
          '/picking-list/picking/withCartNote'
        );
      });

      it('should open picking in progress modal', () => {
        expect(getPickingInProgressModal().open).toBe(true);
      });

      describe('and picking in progress modal is dismissed', () => {
        beforeEach(() => {
          getPickingInProgressModal()
            .shadowRoot?.querySelector('oryx-modal')
            ?.shadowRoot?.querySelector('dialog')
            ?.click();
        });

        it('should not navigate to picking lists', () => {
          expect(routerService.navigate).not.toHaveBeenCalledWith('/');
        });

        it('should close modal', () => {
          expect(getPickingInProgressModal().open).toBe(false);
        });
      });

      describe('and back to pick lists button is clicked', () => {
        beforeEach(() => {
          getPickingInProgressModal()
            .shadowRoot?.querySelector<HTMLElement>('oryx-button')
            ?.click();
        });

        it('should navigate to picking lists', () => {
          expect(routerService.navigate).toHaveBeenCalledWith('/');
        });
      });
    });
  });
});
