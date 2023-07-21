import {
  checkSlots,
  getShadowElementBySelector,
  userAgentFirefox109,
} from '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { clear, mockUserAgent } from 'jest-useragent-mock';
import { html } from 'lit';
import { ModalComponent } from './modal.component';
import { modalComponent } from './modal.def';

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

  const expectBodyOverflow = (overflow: string): void => {
    expect(document.body.style.getPropertyValue('overflow')).toBe(overflow);
  };

  beforeAll(async () => {
    await useComponent(modalComponent);
  });

  beforeEach(() => {
    document.body.style.removeProperty('overflow');
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
        element = await fixture(html`<oryx-modal heading="test"></oryx-modal>`);
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
          html`<oryx-modal open heading="test"></oryx-modal>`
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
      element = await fixture(html`<oryx-modal heading="test"></oryx-modal>`);
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
        html`<oryx-modal open heading="test"></oryx-modal>`
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
        html`<oryx-modal preventCloseByBackdrop heading="test"></oryx-modal>`
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
        html`<oryx-modal preventCloseByEscape heading="test"></oryx-modal>`
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

  describe('when the heading is provided by prop', () => {
    const headingText = 'Header text';
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal .heading=${headingText}></oryx-modal>`
      );
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should pass heading prop to oryx-card as prop', () => {
      const headerSlot = element?.shadowRoot?.querySelector(
        'oryx-card slot[name=heading]'
      );
      expect(headerSlot?.textContent).toContain(headingText);
    });
  });

  describe('when close button is enabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-modal enableCloseButtonInHeader></oryx-modal>`
      );
    });

    it('should render close button in the header', () => {
      expect(element).toContainElement('header > oryx-icon-button');
    });
  });

  describe('when footer is enabled', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal enableFooter></oryx-modal>`);
    });

    it('should render the footer', () => {
      expect(element).toContainElement('footer');
    });
  });

  describe('when go back button is enabled', () => {
    const callback = vi.fn();
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-modal open enableNavigateBack @oryx.back=${callback}></oryx-modal>
      `);
    });

    it('should render the button', () => {
      expect(element).toContainElement('oryx-icon-button:first-child');
    });

    describe('and the button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('slot[name="navigate-back"]')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should dispatch the event', () => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('body scroll lock', () => {
    describe('when modal is closed by default', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-modal></oryx-modal>`);
      });

      it('should not lock body scroll', () => {
        expectBodyOverflow('');
      });

      describe('and modal is opened', () => {
        beforeEach(async () => {
          element.toggleAttribute('open', true);
        });

        it('should lock body scroll', () => {
          expectBodyOverflow('clip');
        });
      });
    });

    describe('when body has default overflow style', () => {
      const overflow = 'auto';
      beforeEach(async () => {
        document.body.style.overflow = overflow;
        element = await fixture(html`<oryx-modal open></oryx-modal>`);
      });

      it('should lock body scroll', () => {
        expectBodyOverflow('clip');
      });

      describe('and modal is closed', () => {
        beforeEach(async () => {
          document.body.style.overflow = overflow;
          element = await fixture(html`<oryx-modal open></oryx-modal>`);
          element.toggleAttribute('open', false);
        });

        it('should restore default value', () => {
          expectBodyOverflow(overflow);
        });
      });
    });

    describe('Firefox behavior', () => {
      beforeEach(async () => {
        mockUserAgent(userAgentFirefox109);
        element = await fixture(html`<oryx-modal></oryx-modal>`);
      });

      afterEach(() => {
        clear();
      });

      it('should set default value to auto', () => {
        expectBodyOverflow('auto');
      });
    });
  });

  checkSlots(['heading', 'default', 'footer'], {
    tag: 'oryx-modal',
    attributes: ['open', 'enableFooter'],
  });
});
