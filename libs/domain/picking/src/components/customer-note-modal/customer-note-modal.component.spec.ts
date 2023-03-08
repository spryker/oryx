import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { customerNoteModalComponent } from '@spryker-oryx/picking';
import { html } from 'lit';
import { CustomerNoteModal } from './customer-note-modal.component';

describe('CustomerNoteModalComponent', () => {
  let element: CustomerNoteModal;

  beforeAll(async () => {
    await useComponent([customerNoteModalComponent]);
  });

  describe('when customerNote prop is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-customer-note-modal></oryx-customer-note>`
      );
    });

    it('modal should be closed', () => {
      expect(
        element.renderRoot.querySelector('oryx-modal')?.hasAttribute('open')
      ).toBe(false);
    });
  });

  describe('when customerNote prop is provided', () => {
    const customerNote = 'This is a note';
    beforeEach(async () => {
      element = await fixture(
        html`
					<oryx-customer-note-modal 
						.customerNote=${customerNote} 
					</oryx-customer-note>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should be opened', () => {
      expect(
        element.renderRoot.querySelector('oryx-modal')?.hasAttribute('open')
      ).toBe(true);
    });

    it('should have proper heading', () => {
      expect(
        element.renderRoot.querySelector('span[slot="heading"]')?.textContent
      ).toBe('Customer note');
    });

    it('should render a modal with the provided customer note', async () => {
      expect(
        element.renderRoot.querySelector('oryx-modal')?.textContent
      ).contains(customerNote);
    });

    it('should dispatch a "close" event when the "Got it" button is clicked', async () => {
      const closeEvent = vi.fn();
      element.addEventListener('close', closeEvent);

      const closeBtn = element.renderRoot.querySelector('button');
      closeBtn?.click();

      expect(closeEvent).toHaveBeenCalled();
    });
  });
});
