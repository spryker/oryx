import { checkSlots, dispatchKeydown } from '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { modalComponent } from '../modal.def';
import { NDSModalComponent } from './modal.component';

describe('NDS Modal', () => {
  let element: NDSModalComponent;

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.HTMLDialogElement = null;

    await useComponent(modalComponent);
  });

  const expectDialogOpen = (shouldBeOpen: boolean): void => {
    if (shouldBeOpen) {
      expect(element.hasAttribute('open')).toBe(true);
    } else {
      expect(element.hasAttribute('open')).toBe(false);
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

    describe('and the `Escape` keydown event was dispatched', () => {
      beforeEach(() => {
        dispatchKeydown(element, 'Escape');
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

        element.shadowRoot?.host.dispatchEvent(event);
      });

      it('should close dialog', () => {
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
      expect(element.hasAttribute('open')).to.be.true;
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
        html`<oryx-modal preventCloseByBackdrop></oryx-modal>`
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
        element.shadowRoot?.host.dispatchEvent(event);
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
        html`<oryx-modal preventCloseByEscape></oryx-modal>`
      );
      element.open();
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('and the Esc button is pressed', () => {
      beforeEach(() => {
        dispatchKeydown(element, 'Escape');
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
  checkSlots(['heading', 'default', 'footer'], {
    tag: 'oryx-modal',
    attributes: ['open', 'enableFooter'],
  });

  describe('when the component is removed from the dom', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-modal open></oryx-modal>`);
      element.disconnectedCallback();
    });

    it('should clear the events handlers', () => {
      dispatchKeydown(element, 'Escape');
      expectDialogOpen(true);

      element.dispatchEvent(new MouseEvent('click', {}));
      expectDialogOpen(true);
    });
  });
});
