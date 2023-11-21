import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingHeaderService } from '@spryker-oryx/picking';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { PickingListService } from '@spryker-oryx/picking/services';
import { RouterService } from '@spryker-oryx/router';
import { BACK_EVENT, CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { pickingDiscardModalComponent } from '../discard-warning/discard-warning.def';
import { PickingPickerHeaderComponent } from './picker-header.component';
import { pickingPickerHeaderComponent } from './picker-header.def';

class MockPickingListService implements Partial<PickingListService> {
  getList = vi.fn().mockReturnValue(of(mockPickingListData[0]));
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

describe('PickingPickerHeaderComponent', () => {
  let element: PickingPickerHeaderComponent;
  let service: MockPickingListService;
  let routerService: MockRouterService;
  let pickingHeaderService: MockPickingHeaderService;

  beforeAll(async () => {
    await useComponent([
      pickingPickerHeaderComponent,
      pickingDiscardModalComponent,
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
        {
          provide: PickingHeaderService,
          useClass: MockPickingHeaderService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-picking-picker-header
        pickingListId="mockid"
      ></oryx-picking-picker-header>`
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

  describe('when component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-picking-picker-header
          pickingListId="mockid"
        ></oryx-picking-picker-header>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(PickingPickerHeaderComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render header component', () => {
      expect(element).toContainElement('oryx-picking-header');
    });

    it('should render back button', () => {
      const backButton = element.renderRoot.querySelector(
        'oryx-picking-header oryx-button:first-of-type'
      );

      expect(backButton).toHaveProperty(
        'label',
        i18n('picking.back-to-pick-lists')
      );
    });

    it('should render id', () => {
      expect(element.renderRoot.querySelector('.title')?.textContent).toContain(
        mockPickingListData[0].orderReferences[0]
      );
    });

    it('should render customer note button', () => {
      expect(element).toContainElement('.title + oryx-button');
    });

    it('should render discard modal', () => {
      expect(element).toContainElement('oryx-picking-discard-modal');
    });

    it('should not show discard modal', () => {
      expect(element).toContainElement(
        'oryx-picking-discard-modal:not([open])'
      );
    });
  });

  describe('when customer note button is clicked', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector<HTMLElement>('.title + oryx-button')
        ?.click();
    });

    it('should provide the note text to customer-note-modal component', () => {
      const customerNodeModal = element.renderRoot.querySelector(
        'oryx-picking-customer-note-modal'
      );
      expect(customerNodeModal?.hasAttribute('open')).toBe(true);
      expect(customerNodeModal?.textContent?.trim()).toBe(
        mockPickingListData[0].cartNote
      );
    });
  });

  describe('when picking list does not have customer note', () => {
    beforeEach(async () => {
      service.getList = vi.fn().mockReturnValue(of(mockPickingListData[1]));

      element = await fixture(
        html`<oryx-picking-picker-header
          pickingListId="mockid"
        ></oryx-picking-picker-header>`
      );
    });

    it('should not render customer note button', () => {
      element.renderRoot
        .querySelectorAll<HTMLElement>('oryx-button')
        .forEach((el) =>
          expect(el).not.toHaveProperty('text', 'Customer note')
        );
    });

    it('should not render customer note modal', () => {
      expect(
        element.renderRoot.querySelector('oryx-picking-customer-note-modal')
      ).toBeNull();
    });
  });

  describe('when back button is clicked', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector<HTMLElement>('oryx-picking-header oryx-button')
        ?.click();
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
      expect(element).toContainElement('oryx-picking-discard-modal[open]');
    });

    describe('and close button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-picking-discard-modal')
          ?.dispatchEvent(
            new CustomEvent(CLOSE_EVENT, { bubbles: true, composed: true })
          );
      });

      it('should close discard modal', () => {
        expect(element).toContainElement(
          'oryx-picking-discard-modal:not([open])'
        );
      });

      it('should call picking header service cancel', () => {
        expect(pickingHeaderService.cancel).toHaveBeenCalled();
      });
    });

    describe('and discard button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-picking-discard-modal')
          ?.dispatchEvent(
            new CustomEvent(BACK_EVENT, { bubbles: true, composed: true })
          );
      });

      it('should call picking header service discard', () => {
        expect(pickingHeaderService.discard).toHaveBeenCalled();
      });
    });
  });
});
