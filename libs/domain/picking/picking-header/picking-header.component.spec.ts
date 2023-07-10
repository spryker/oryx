import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  PickingHeaderService,
  PickingListService,
} from '@spryker-oryx/picking';
import { CustomerNoteModalComponent } from '@spryker-oryx/picking/customer-note-modal';
import { DiscardPickingComponent } from '@spryker-oryx/picking/discard-modal';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { discardModalComponent } from '../discard-modal/discard-modal.def';
import { PickingHeaderComponent } from './picking-header.component';
import { pickingHeaderComponent } from './picking-header.def';

class MockPickingListService implements Partial<PickingListService> {
  get = vi.fn().mockReturnValue(of([mockPickingListData[0]]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

const showDialogTrigger = new BehaviorSubject(false);

class MockPickingHeaderService implements Partial<PickingHeaderService> {
  showDialog = vi.fn().mockImplementation(() => showDialogTrigger);
  cancel = vi.fn();
  discard = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
}

describe('PickingHeaderComponent', () => {
  let element: PickingHeaderComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;
  let pickingHeaderService: MockPickingHeaderService;

  beforeAll(async () => {
    await useComponent([pickingHeaderComponent, discardModalComponent]);
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
        {
          provide: PickingHeaderService,
          useClass: MockPickingHeaderService,
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
    pickingHeaderService = testInjector.inject(
      PickingHeaderService
    ) as unknown as MockPickingHeaderService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  const getCustomerNoteModal = (): CustomerNoteModalComponent | null =>
    element.renderRoot.querySelector('oryx-customer-note-modal');

  const getCustomerNoteButton = () => {
    return element.renderRoot.querySelector(
      'oryx-icon-button button[aria-label="Customer note"]'
    );
  };

  const getBackButton = () => {
    return element.renderRoot.querySelector(
      'button[aria-label="Back to pick lists"]'
    );
  };

  const getDiscardModal = (): DiscardPickingComponent | null =>
    element.renderRoot.querySelector('oryx-discard-picking');

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
    ).toContain(mockPickingListData[0].orderReferences[0]);
  });

  it('should render customer note button', () => {
    expect(getCustomerNoteButton()).not.toBeNull();
  });

  it('should render discard modal', () => {
    expect(getDiscardModal()).not.toBeNull();
  });

  it('should not show discard modal', () => {
    expect(getDiscardModal()?.hasAttribute('open')).toBe(false);
  });

  it('should render account button', () => {
    expect(
      element.renderRoot.querySelector('oryx-site-navigation-item')
    ).not.toBeNull();
  });

  describe('when customer note button is clicked', () => {
    beforeEach(() => {
      (getCustomerNoteButton() as HTMLButtonElement).click();
    });

    it('should provide the note text to customer-note-modal component', () => {
      expect(getCustomerNoteModal()?.hasAttribute('open')).toBe(true);
      expect(getCustomerNoteModal()?.textContent?.trim()).toBe(
        mockPickingListData[0].cartNote
      );
    });
  });

  describe('when picking list does not have customer note', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of([mockPickingListData[1]]));

      element = await fixture(
        html`<oryx-picking-header pickingListId="mockid"></oryx-picking-header>`
      );
    });

    it('should not render customer note button', () => {
      expect(getCustomerNoteButton()).toBeNull();
    });

    it('should not render customer note modal', () => {
      expect(getCustomerNoteModal()).toBeNull();
    });
  });

  describe('when back button is clicked', () => {
    beforeEach(() => {
      (getBackButton() as HTMLButtonElement).click();
    });

    it('should call router service back', () => {
      expect(routerService.back).toHaveBeenCalled();
    });
  });

  describe('when route guard is triggered', () => {
    beforeEach(async () => {
      showDialogTrigger.next(true);
    });
    it('should open discard modal', () => {
      expect(getDiscardModal()?.hasAttribute('open')).toBe(true);
    });

    describe('and close button is clicked', () => {
      beforeEach(() => {
        getDiscardModal()?.renderRoot.querySelector('button')?.click();
      });

      it('should close discard modal', () => {
        expect(getDiscardModal()?.hasAttribute('open')).toBe(false);
      });

      it('should call picking header service cancel', () => {
        expect(pickingHeaderService.cancel).toHaveBeenCalled();
      });
    });

    describe('and discard button is clicked', () => {
      beforeEach(() => {
        getDiscardModal()?.renderRoot.querySelectorAll('button')[1]?.click();
      });

      it('should call picking header service discard', () => {
        expect(pickingHeaderService.discard).toHaveBeenCalled();
      });
    });
  });
});
