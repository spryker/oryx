import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import { a11yConfig } from '../../../../a11y';
import { dispatchKeydown } from '../../../../utilities';
import { checkSlots } from '../../../../utilities/slot.spec.util';
import { NDSModalComponent } from './modal.component';

customElements.get('oryx-modal-nds') ||
  customElements.define('oryx-modal-nds', NDSModalComponent);

describe('NDS Modal', () => {
  let element: NDSModalComponent;

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
      element = await fixture(html`<oryx-modal-nds></oryx-modal-nds>`);
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
      element = await fixture(html`<oryx-modal-nds open></oryx-modal-nds>`);
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
        html`<oryx-modal-nds disableCloseOnBackdrop></oryx-modal-nds>`
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
        html`<oryx-modal-nds disableCloseOnEscape></oryx-modal-nds>`
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
      element = await fixture(html`<oryx-modal-nds></oryx-modal-nds>`);
    });

    it('should not open dialog', () => {
      expectDialogOpen(false);
    });
  });
  checkSlots(['header', 'default', 'footer'], {
    tag: 'oryx-modal-nds',
    attributes: ['open'],
  });
});
