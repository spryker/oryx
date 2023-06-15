import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import {
  Address,
  AddressService,
  AddressStateService,
  CrudState,
  userAddressAddButtonComponent,
} from '@spryker-oryx/user';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressAddButtonComponent } from './address-add-button.component';
import {
  Target,
  UserAddressAddButtonOptions,
} from './address-add-button.model';

class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn();
  getAddresses = vi.fn();
  deleteAddress = vi.fn().mockReturnValue(of({}));
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
}

const mockState = new BehaviorSubject<{
  action: CrudState;
  selected?: Address | null;
}>({
  action: CrudState.Read,
  selected: null,
});
class MockAddressStateService implements Partial<AddressStateService> {
  set = vi.fn();
  get = vi.fn().mockReturnValue(mockState);
  clear = vi.fn();
}
class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

describe('UserAddressAddButtonComponent', () => {
  let element: UserAddressAddButtonComponent;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(userAddressAddButtonComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
        {
          provide: AddressStateService,
          useClass: MockAddressStateService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });

    addressStateService =
      testInjector.inject<MockAddressStateService>(AddressStateService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is instantiated', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-add-button></oryx-user-address-add-button>`
      );
    });

    it('should be an instance of UserAddressAddButtonComponent', () => {
      expect(element).toBeInstanceOf(UserAddressAddButtonComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the target option is set to link', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-add-button
          .options=${{ target: Target.Link } as UserAddressAddButtonOptions}
        ></oryx-user-address-add-button>`
      );
    });

    it('should render an anchor link', () => {
      expect(element).toContainElement('a');
    });

    it('should not render a button', () => {
      expect(element).not.toContainElement('button');
    });

    describe('and the click event is dispatched on the button', () => {
      beforeEach(() => {
        element.renderRoot.querySelector('a')?.click();
      });

      it('should set the state to Create', () => {
        expect(addressStateService.set).toHaveBeenCalledWith(
          CrudState.Create,
          null
        );
      });
    });
  });

  describe('when the target option is set to inline', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-add-button
          .options=${{ target: Target.Inline } as UserAddressAddButtonOptions}
        ></oryx-user-address-add-button>`
      );
    });

    it('should not render an anchor link', () => {
      expect(element).not.toContainElement('a');
    });

    it('should render a button', () => {
      expect(element).toContainElement('button');
    });

    describe('and the click event is dispatched on the button', () => {
      beforeEach(() => {
        element.renderRoot.querySelector('button')?.click();
      });

      it('should set the state to Create', () => {
        expect(addressStateService.set).toHaveBeenCalledWith(
          CrudState.Create,
          null
        );
      });
    });
  });

  describe('when the target option is set to modal', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-add-button
          .options=${{ target: Target.Modal } as UserAddressAddButtonOptions}
        ></oryx-user-address-add-button>`
      );
    });

    it('should not render an anchor link', () => {
      expect(element).not.toContainElement('a');
    });

    it('should render a button', () => {
      expect(element).toContainElement('button');
    });

    describe('and the click event is dispatched on the button', () => {
      beforeEach(() => {
        element.renderRoot.querySelector('button')?.click();
      });

      it('should set the state to Create', () => {
        expect(addressStateService.set).toHaveBeenCalledWith(
          CrudState.Create,
          null
        );
      });
    });

    describe('and the action state = Create', () => {
      beforeEach(() => {
        mockState.next({ action: CrudState.Create });
      });

      it('should render the modal', () => {
        expect(element).toContainElement('oryx-modal oryx-user-address-edit');
      });

      describe('and the close event is dispatched', () => {
        beforeEach(() => {
          element.renderRoot
            .querySelector('oryx-modal')
            ?.dispatchEvent(new Event('oryx.close'));
        });

        it('should clear the state', () => {
          expect(addressStateService.clear).toHaveBeenCalled();
        });
      });
    });
  });
});
