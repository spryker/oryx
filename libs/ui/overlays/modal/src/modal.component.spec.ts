import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import { a11yConfig } from '../../../a11y';
import { checkSlots } from '../../../utilities/slot.spec.util';
import { ModalComponent } from './modal.component';
import { NDSModalComponent } from './no-dialog-support/modal.component';

/* eslint-disable */
// @ts-ignore
if (window.HTMLDialogElement) {
  // JsDom doesn't have implementation for open/close dialog
  // @ts-ignore
  window.HTMLDialogElement.prototype.showModal = function (): void {
    this.setAttribute('open', '');
  };
  // @ts-ignore
  window.HTMLDialogElement.prototype.close = function (): void {
    this.removeAttribute('open');
  };

  customElements.get('oryx-modal') ||
    customElements.define('oryx-modal', ModalComponent);
} else {
  customElements.get('oryx-modal') ||
    customElements.define('oryx-modal', NDSModalComponent);
}
/* eslint-enable */

describe('Modal', () => {
  let element: ModalComponent;

  const expectDialogOpen = (shouldBeOpen: boolean): void => {
    const dialog = element?.renderRoot?.querySelector('dialog');

    if (shouldBeOpen) {
      expect(dialog?.hasAttribute('open')).toBe(true);
    } else {
      expect(dialog?.hasAttribute('open')).toBe(false);
    }
  };

  const testCloseStrategies = (): void => {
    describe('and than "close" method was called', () => {
      beforeEach(() => {
        element.close();
      });

      it('should close dialog', () => {
        expectDialogOpen(false);
      });
    });

    describe('and than prop "open" was removed', () => {
      beforeEach(() => {
        element.removeAttribute('open');
      });

      it('should close', () => {
        expectDialogOpen(false);
      });
    });

    describe('and than "cancel" event was triggered', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-modal></oryx-modal>`);
        element.open();
        const event = new Event('cancel', {
          bubbles: true,
          cancelable: true,
        });
        element.shadowRoot?.querySelector('dialog')?.dispatchEvent(event);
      });

      it('should close dialog', () => {
        expectDialogOpen(false);
      });
    });

    describe('and than dialog overlay was clicked', () => {
      beforeEach(() => {
        const event = new Event('click', {
          bubbles: true,
        });
        element.shadowRoot?.querySelector('dialog')?.dispatchEvent(event);
      });

      it('should not close', () => {
        expectDialogOpen(false);
      });
    });
  };

  it('is defined', () => {
    const el = document.createElement('oryx-modal');
    expect(el).toBeInstanceOf(ModalComponent);
  });

  describe('when is open by "open" method', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal></oryx-modal>`);
      element.open();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should have an "open" attribute', () => {
      expect(element.hasAttribute('open')).toBe(true);
    });

    it('should open dialog', () => {
      expectDialogOpen(true);
    });

    testCloseStrategies();
  });

  describe('when is open by "open" property', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal open></oryx-modal>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should open dialog', () => {
      expectDialogOpen(true);
    });

    testCloseStrategies();
  });

  describe('when closing by backdrop click is disabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal disableCloseOnBackdrop></oryx-modal>`
      );
      element.open();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('and than dialog overlay was clicked', () => {
      beforeEach(() => {
        const event = new Event('click', {
          bubbles: true,
        });
        element.shadowRoot?.querySelector('dialog')?.dispatchEvent(event);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not close', () => {
        expectDialogOpen(true);
      });
    });
  });

  describe('when closing on Escape is disable', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal disableCloseOnEscape></oryx-modal>`
      );
      element.open();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('and than "cancel" event was triggered', () => {
      beforeEach(() => {
        const event = new Event('cancel', {
          bubbles: true,
          cancelable: true,
        });

        element.shadowRoot?.querySelector('dialog')?.dispatchEvent(event);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not close', () => {
        expectDialogOpen(true);
      });
    });
  });

  describe('when is close', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal></oryx-modal>`);
    });

    it('should not open dialog', () => {
      expectDialogOpen(false);
    });
  });

  describe('when header is provided by prop', () => {
    const headerText = 'Header text';
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal .header=${headerText}></oryx-modal>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should pass header prop to oryx-card as prop', () => {
      const headerSlot = element?.shadowRoot?.querySelector(
        'oryx-card slot[name=header]'
      );
      expect(headerSlot?.textContent?.trim()).toEqual(headerText);
    });
  });

  checkSlots(['header', 'default', 'footer'], {
    tag: 'oryx-modal',
    attributes: ['open'],
  });
});
