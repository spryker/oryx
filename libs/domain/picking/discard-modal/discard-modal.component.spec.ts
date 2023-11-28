import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingGuardService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { PickingDiscardModalComponent } from './discard-modal.component';
import { pickingDiscardModalComponent } from './discard-modal.def';

class MockPickingGuardService implements Partial<PickingGuardService> {
  allow = vi.fn();
  isProtected = vi.fn().mockReturnValue(of(true));
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
}

describe('PickingDiscardModalComponent', () => {
  let element: PickingDiscardModalComponent;
  let routerService: MockRouterService;
  let guardService: MockPickingGuardService;

  beforeAll(async () => {
    await useComponent(pickingDiscardModalComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: PickingGuardService,
          useClass: MockPickingGuardService,
        },
      ],
    });

    routerService = testInjector.inject<MockRouterService>(RouterService);
    guardService =
      testInjector.inject<MockPickingGuardService>(PickingGuardService);

    element = await fixture(
      html`<oryx-picking-discard-modal></oryx-picking-discard-modal>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render the trigger', () => {
    expect(element).toContainElement('oryx-button:not([slot])');
  });

  it('should render modal', () => {
    expect(element).toContainElement('oryx-modal');
  });

  describe('when trigger is clicked', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('oryx-button:not([slot])')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should open the modal', () => {
      expect(element).toContainElement('oryx-modal[open]');
    });

    describe('and cancel button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelectorAll('oryx-button[slot]')[0]
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });

      it('should not call the services', () => {
        expect(routerService.back).not.toHaveBeenCalled();
        expect(guardService.allow).not.toHaveBeenCalled();
      });
    });

    describe('and discard button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelectorAll('oryx-button[slot]')[1]
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });

      it('should call the services', () => {
        expect(routerService.back).toHaveBeenCalled();
        expect(guardService.allow).toHaveBeenCalled();
      });
    });

    describe('and guard is not active', () => {
      beforeEach(async () => {
        guardService.isProtected = vi.fn().mockReturnValue(of(false));

        element = await fixture(
          html`<oryx-picking-discard-modal></oryx-picking-discard-modal>`
        );

        element.renderRoot
          .querySelector('oryx-button:not([slot])')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should not open the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });

      it('should navigate back', () => {
        expect(routerService.back).toHaveBeenCalled();
      });
    });
  });
});
