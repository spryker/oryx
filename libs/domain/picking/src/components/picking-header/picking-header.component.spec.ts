import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { CustomerNoteModalComponent } from '@spryker-oryx/picking';
import { mockPickingListData } from '@spryker-oryx/picking/src/mocks';
import { RouterService } from '@spryker-oryx/router';
import { ROUTE_GUARDED_EVENT } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { of } from 'rxjs';
import { PickingListService } from '../../services';
import { DiscardPickingComponent } from '../discard-modal';
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
    ).toContain('mockOrderReference');
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

    it('should open discard modal', () => {
      expect(getDiscardModal()?.hasAttribute('open')).toBe(true);
    });
  });

  describe('when route is guarded', () => {
    beforeEach(async () => {
      dispatchEvent(new CustomEvent(ROUTE_GUARDED_EVENT));
    });

    it('should open discard modal', () => {
      expect(getDiscardModal()?.hasAttribute('open')).toBe(true);
    });
  });
});
