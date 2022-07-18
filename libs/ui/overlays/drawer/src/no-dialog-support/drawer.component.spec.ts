import { fixture } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { html } from 'lit';
import { NDSDrawerComponent } from './drawer.component';

customElements.get('nds-drawer') ||
  customElements.define('nds-drawer', NDSDrawerComponent);

const isClosed = (element: NDSDrawerComponent): boolean => !element.open;

describe('NDSDrawerComponent', () => {
  let element: NDSDrawerComponent;

  const update = async (): Promise<void> => {
    element.requestUpdate();
    await element.updateComplete;
  };

  describe('dialog methods', () => {
    beforeEach(async () => {
      element = await fixture(html`<nds-drawer></nds-drawer>`);
    });
    it('should toggle opened state', async () => {
      element.dialog?.show();
      await update();
      expect(isClosed(element)).toBe(false);

      element.dialog?.close();
      await update();
      expect(isClosed(element)).toBe(true);
    });

    it('should do nothing when showModal method is calling', async () => {
      element.dialog?.showModal();
      expect(isClosed(element)).toBe(true);
    });
  });

  const getButton = (selector = 'button'): HTMLElement | null | undefined =>
    getShadowElementBySelector(element, selector);

  describe('click event', () => {
    beforeEach(async () => {
      element = await fixture(html`<nds-drawer open></nds-drawer>`);
    });

    it('should close the drawer on click on close button', async () => {
      const closeButton = getButton('button[value="cancel"]');
      closeButton?.click();
      await update();
      expect(isClosed(element)).toBe(true);
    });
  });
});
