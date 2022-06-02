import { fixture } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { html } from 'lit';
import { a11yConfig } from '../../../a11y';
import { checkSlots } from '../../../testing/slot.util';
import { ModalComponent } from './modal.component';

customElements.get('oryx-modal') ||
  customElements.define('oryx-modal', ModalComponent);

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
    describe('and the "close()" method is called', () => {
      beforeEach(() => {
        element.close();
      });

      it('should close dialog', () => {
        expectDialogOpen(false);
      });
    });

    describe('and the "open" prop is removed', () => {
      beforeEach(() => {
        element.removeAttribute('open');
      });

      it('should close', () => {
        expectDialogOpen(false);
      });
    });

    describe('and the "cancel" event is triggered', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-modal></oryx-modal>`);
        element.open();
        const event = new Event('cancel', {
          bubbles: true,
          cancelable: true,
        });
        getShadowElementBySelector(element, 'dialog')?.dispatchEvent(event);
      });

      it('should close dialog', () => {
        expectDialogOpen(false);
      });
    });

    describe('and the dialog overlay is clicked', () => {
      beforeEach(() => {
        const event = new Event('click', {
          bubbles: true,
        });
        getShadowElementBySelector(element, 'dialog')?.dispatchEvent(event);
      });

      it('should not close', () => {
        expectDialogOpen(false);
      });
    });
  };

  describe('when the "open()" method is called', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal></oryx-modal>`);
      element.open();
    });

    it('should pass the a11y audit', async () => {
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

  describe('when the "open" attribute is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal open></oryx-modal>`);
    });

    it('should pass the a11y audit', async () => {
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

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('and the dialog overlay is clicked', () => {
      beforeEach(() => {
        const event = new Event('click', {
          bubbles: true,
        });
        getShadowElementBySelector(element, 'dialog')?.dispatchEvent(event);
      });

      it('should pass the a11y audit', async () => {
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

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('and the "cancel" event is triggered', () => {
      beforeEach(() => {
        const event = new Event('cancel', {
          bubbles: true,
          cancelable: true,
        });

        getShadowElementBySelector(element, 'dialog')?.dispatchEvent(event);
      });

      it('should pass the a11y audit', async () => {
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

  describe('when the header is provided by prop', () => {
    const headerText = 'Header text';
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal .header=${headerText}></oryx-modal>`
      );
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should pass header prop to oryx-card as prop', () => {
      const headerSlot = element?.shadowRoot?.querySelector(
        'oryx-card slot[name=header]'
      );
      expect(headerSlot?.textContent).toContain(headerText);
    });
  });

  checkSlots(['header', 'default', 'footer'], {
    tag: 'oryx-modal',
    attributes: ['open'],
  });
});
