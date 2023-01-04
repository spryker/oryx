import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { checkSlots, getShadowElementBySelector } from '@spryker-oryx/testing';
import { a11yConfig } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { modalComponent } from './component';
import { ModalComponent } from './modal.component';

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

  beforeAll(async () => {
    await useComponent(modalComponent);
  });

  const testCloseStrategies = (): void => {
    describe('when the "close()" method is called', () => {
      const callback = vi.fn();
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-modal open @oryx.close=${callback}></oryx-modal>`
        );
        element.close();
      });

      it('should close dialog', () => {
        expectDialogOpen(false);
      });

      it('should dispatch close event', () => {
        expect(callback).toHaveBeenCalled();
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
        element = await fixture(html`<oryx-modal header="test"></oryx-modal>`);
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

    describe('when the dialog backdrop is clicked', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-modal open header="test"></oryx-modal>`
        );
      });

      it('should close the modal', () => {
        getShadowElementBySelector(element, 'dialog')?.dispatchEvent(
          new Event('click', {
            bubbles: true,
            composed: true,
          })
        );

        expectDialogOpen(false);
      });
    });
  };

  describe('when the "open()" method is called', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal header="test"></oryx-modal>`);
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
      element = await fixture(
        html`<oryx-modal open header="test"></oryx-modal>`
      );
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
        html`<oryx-modal preventCloseWithBackdrop header="test"></oryx-modal>`
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
        html`<oryx-modal preventCloseWithEscape header="test"></oryx-modal>`
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

  describe('when close button is hidden', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal withoutCloseButton></oryx-modal>`
      );
    });

    it('should not render close button in the header', () => {
      expect(element).not.toContainElement('header > oryx-icon-button');
    });
  });

  describe('when footer is hidden', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal withoutFooter></oryx-modal>`);
    });

    it('should not render the footer', () => {
      expect(element).not.toContainElement('footer');
    });
  });

  checkSlots(['header', 'default', 'footer'], {
    tag: 'oryx-modal',
    attributes: ['open'],
  });
});
