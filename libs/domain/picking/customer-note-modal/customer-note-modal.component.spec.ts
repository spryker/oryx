import { fixture } from '@open-wc/testing-helpers';
import { CLOSE_EVENT, ModalComponent } from '@spryker-oryx/ui/modal';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { afterEach, beforeAll, beforeEach } from 'vitest';
import { CustomerNoteModalComponent } from './customer-note-modal.component';
import { customerNoteModalComponent } from './customer-note-modal.def';

describe('CustomerNoteModal', () => {
  let element: CustomerNoteModalComponent;

  const getModal = (): ModalComponent | null =>
    element.renderRoot.querySelector('oryx-modal');

  beforeAll(async () => {
    await useComponent([customerNoteModalComponent]);
  });

  describe('when note property is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-customer-note-modal></oryx-customer-note-modal>`
      );
    });

    it('should not show the modal', () => {
      expect(getModal()?.hasAttribute('open')).toBe(false);
    });
  });

  describe('when note property is provided', () => {
    const noteText = 'note text';
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-customer-note-modal open>
          ${noteText}
        </oryx-customer-note-modal>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should show the modal', () => {
      expect(getModal()?.hasAttribute('open')).toBe(true);
    });

    it('should contain the text', () => {
      expect(element?.textContent?.trim()).toBe(noteText);
    });

    describe('and close event is triggered', () => {
      const spy = vi.fn();

      beforeEach(() => {
        element.addEventListener(CLOSE_EVENT, spy);
      });

      afterEach(() => {
        element.removeEventListener(CLOSE_EVENT, spy);
      });

      it(`should emit ${CLOSE_EVENT} event when on button click`, () => {
        getModal()?.querySelector<HTMLElement>('oryx-button')?.click();
        expect(spy).toBeCalled();
      });

      it(`should emit ${CLOSE_EVENT} event when modal component emitted ${CLOSE_EVENT} event`, () => {
        getModal()?.dispatchEvent(new CustomEvent(CLOSE_EVENT));
        expect(spy).toBeCalled();
      });
    });
  });
});
