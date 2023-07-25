import { getShadowElementBySelector } from '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { drawerComponent } from '../component';
import { NDSDrawerComponent } from './drawer.component';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.HTMLDialogElement = null;

describe('NDSDrawerComponent', () => {
  let element: NDSDrawerComponent;

  beforeAll(async () => {
    await useComponent(drawerComponent);
  });

  describe('dialog methods', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-drawer></oryx-drawer>`);
    });
    it('should toggle opened state', async () => {
      element.dialog?.show();
      await element.updateComplete;
      expect(element.open).toBe(true);

      element.dialog?.close();
      await element.updateComplete;
      expect(element.open).toBe(false);
    });

    it('should do nothing when showModal method is calling', async () => {
      element.dialog?.showModal();
      expect(element.open).toBe(false);
    });
  });

  describe('click event', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-drawer open></oryx-drawer>`);
    });

    it('should close the drawer on click on close button', async () => {
      const closeButton = getShadowElementBySelector(
        element,
        'button[value="cancel"]'
      );
      closeButton?.click();
      await element.updateComplete;
      expect(element.open).toBe(false);
    });
  });
});
