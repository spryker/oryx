import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  AddressService,
  AddressStateService,
  CrudState,
  userAddressEditButtonComponent,
} from '@spryker-oryx/user';

import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressEditButtonComponent } from './address-edit-button.component';
import { AddressEditButtonOptions, Target } from './address-edit-button.model';

class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn();
  getAddresses = vi.fn();
  deleteAddress = vi.fn().mockReturnValue(of({}));
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
}
const mockAction = new BehaviorSubject<CrudState>(CrudState.Read);
class MockAddressStateService implements Partial<AddressStateService> {
  getAction = vi.fn().mockReturnValue(mockAction);
  setAction = vi.fn();
  select = vi.fn();
  selected = vi.fn();
}
class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

describe('UserAddressEditButtonComponent', () => {
  let element: UserAddressEditButtonComponent;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(userAddressEditButtonComponent);
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
        html`<oryx-user-address-edit-button></oryx-user-address-edit-button>`
      );
    });

    it('should be an instance of UserAddressEditButtonComponent', () => {
      expect(element).toBeInstanceOf(UserAddressEditButtonComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the target option is set to link', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-edit-button
          .options=${{ target: Target.Link } as AddressEditButtonOptions}
        ></oryx-user-address-add-button>`
      );
    });

    it('should render an anchor link', () => {
      expect(element).toContainElement('a');
    });

    it('should not render a button', () => {
      expect(element).not.toContainElement('button');
    });
  });

  describe('when the target option is set to inline', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-edit-button
          addressId="foo"
          .options=${{ target: Target.Inline } as AddressEditButtonOptions}
        ></oryx-user-address-edit-button>`
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

      it('should change the action state to Create', () => {
        expect(addressStateService.setAction).toHaveBeenCalledWith(
          CrudState.Update
        );
      });
    });
  });
});
