import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { siteProviders } from '@spryker-oryx/site';
import { html } from 'lit';
import { cartEntryConfirmationComponent } from './component';
import { CartEntryConfirmationComponent } from './confirmation.component';

describe('CartEntryConfirmationComponent', () => {
  let element: CartEntryConfirmationComponent;

  const getNotification = (): HTMLElement => {
    return element.renderRoot.querySelector('oryx-notification')!;
  };

  beforeAll(async () => {
    await useComponent(cartEntryConfirmationComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: siteProviders,
    });
    element = await fixture(
      html`<cart-entry-confirmation></cart-entry-confirmation>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when removing is cancelled', () => {
    describe('by clicking on cancel button', () => {
      const callback = vi.fn();
      beforeEach(async () => {
        element = await fixture(html`<cart-entry-confirmation
          @cancel=${callback}
        ></cart-entry-confirmation>`);

        (
          getNotification()?.querySelectorAll(
            'oryx-button button'
          )?.[1] as HTMLButtonElement
        )?.click();
      });

      it('should dispatch "@remove" event', () => {
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('by "oryx.close" event of notification', () => {
      const callback = vi.fn();
      beforeEach(async () => {
        element = await fixture(html`<cart-entry-confirmation
          @cancel=${callback}
        ></cart-entry-confirmation>`);

        getNotification()?.dispatchEvent(
          new CustomEvent('oryx.close', { composed: true, bubbles: true })
        );
      });

      it('should dispatch "@remove" event', () => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('and removing is confirmed', () => {
    const callback = vi.fn();
    beforeEach(async () => {
      element = await fixture(html`<cart-entry-confirmation
        @remove=${callback}
      ></cart-entry-confirmation>`);

      (
        getNotification()?.querySelectorAll(
          'oryx-button button'
        )?.[0] as HTMLButtonElement
      )?.click();
    });

    it('should dispatch "@remove" event', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
});
