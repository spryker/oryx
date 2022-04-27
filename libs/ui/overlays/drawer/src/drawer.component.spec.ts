import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { DrawerComponent, TAG_NAME } from '.';
import './index';

/* eslint-disable */
// @ts-ignore
if (window.HTMLDialogElement) {
  // JsDom doesn't have implementation for open/close dialog
  // @ts-ignore
  window.HTMLDialogElement.prototype.show = function (): void {
    this.setAttribute('open', 'open');
  };
  // @ts-ignore
  window.HTMLDialogElement.prototype.close = function (): void {
    this.removeAttribute('open');
  };
}
/* eslint-enable */

customElements.get(TAG_NAME) ||
  customElements.define(TAG_NAME, DrawerComponent);

const isClosed = (element: DrawerComponent): boolean => !element.dialog?.open;
const isMaximized = (element: DrawerComponent): boolean =>
  element.maximize === true;

describe('DrawerComponent', () => {
  let element: DrawerComponent;

  const update = async (): Promise<void> => {
    element.requestUpdate();
    await element.updateComplete;
  };

  describe('handle open', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-drawer></oryx-drawer>`);
    });
    it('should open when setting the attribute "open"', async () => {
      element.setAttribute('open', '');
      await update();
      expect(isClosed(element)).toBe(false);
    });
    it('should open when setting the property "open" to true', async () => {
      element.open = true;
      await update();
      expect(isClosed(element)).toBe(false);
    });
    it('should open when call show method of dialog', async () => {
      element.dialog?.show();
      await update();
      expect(isClosed(element)).toBe(false);
    });
  });

  describe('handle close', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-drawer open></oryx-drawer>`);
    });
    it('should close when removing the attribute "open"', async () => {
      element.removeAttribute('open');
      await update();
      expect(isClosed(element)).toBe(true);
    });
    it('should close when setting the property "open" to false', async () => {
      element.open = false;
      await update();
      expect(isClosed(element)).toBe(true);
    });
  });

  describe('default maximized', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-drawer open maximize></oryx-drawer>`);
    });
    it('should remove maximized attribute on close', async () => {
      element.dialog?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape' })
      );
      await update();
      expect(isMaximized(element)).toBe(false);
    });
    it('should remove maximized attribute on submit event', async () => {
      element.dialog?.dispatchEvent(new Event('submit'));
      await update();
      expect(isMaximized(element)).toBe(false);
    });
  });

  const getButton = (selector = 'button'): HTMLElement | null | undefined =>
    element.shadowRoot?.querySelector(selector);

  describe('control buttons', () => {
    let button: HTMLElement | null | undefined;

    describe('when not-closable and non-resizable attrs are set', () => {
      beforeEach(async () => {
        element = await fixture(
          html` <oryx-drawer open not-closable not-resizable></oryx-drawer> `
        );
      });

      it('should not exists', () => {
        const buttonClose = getButton('button:nth-child(1)');
        const buttonResize = getButton('button:nth-child(2)');
        expect(buttonClose).toBeNull();
        expect(buttonResize).toBeNull();
      });
    });

    describe('close button', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-drawer not-resizable open></oryx-drawer>`
        );
        button = getButton();
      });

      it('should exists', () => {
        expect(button).toBeDefined();
      });
    });

    describe('resize button', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-drawer open not-closable></oryx-drawer>
        `);
        button = getButton();
      });

      it('should exists', () => {
        expect(button).toBeDefined();
      });

      it('should toggle the drawer width', async () => {
        expect(isMaximized(element)).toBe(false);

        button?.click();
        await update();
        expect(isMaximized(element)).toBe(true);

        button?.click();
        await update();
        expect(isMaximized(element)).toBe(false);
      });
    });
  });

  describe('translation', () => {
    const navAriaLabel = 'test 1';
    const closeButtonAriaLabel = 'test 2';
    const minimizeButtonAriaLabel = 'test 3';
    const maximizeButtonAriaLabel = 'test 4';

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-drawer
          id="drawer"
          .navAriaLabel=${navAriaLabel}
          .closeButtonAriaLabel=${closeButtonAriaLabel}
          .minimizeButtonAriaLabel=${minimizeButtonAriaLabel}
          .maximizeButtonAriaLabel=${maximizeButtonAriaLabel}
        ></oryx-drawer>
      `);
    });

    it('should have correct translated aria-labels', async () => {
      const nav = element.shadowRoot?.querySelector('nav');
      const closeBtn = getButton('button:nth-child(1)');
      const resizeBtn = getButton('button:nth-child(2)');

      expect(nav?.getAttribute('aria-label')).toBe(navAriaLabel);
      expect(closeBtn?.getAttribute('aria-label')).toBe(closeButtonAriaLabel);
      expect(resizeBtn?.getAttribute('aria-label')).toBe(
        maximizeButtonAriaLabel
      );

      getButton('button:nth-child(2)')?.click();
      await update();

      expect(resizeBtn?.getAttribute('aria-label')).toBe(
        minimizeButtonAriaLabel
      );
    });
  });

  describe('focus on dialog element', () => {
    beforeAll(async () => {
      vi.useFakeTimers();
      element = await fixture(html`
        <oryx-drawer open>
          <button id="focusable"></button>
          <span id="not-focusable"></span>
        </oryx-drawer>
      `);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should not focus dialog element', () => {
      const focusable = document.querySelector('#focusable') as HTMLElement;
      focusable?.click();
      vi.advanceTimersByTime(0);
      expect(element.matches(':focus')).toBe(false);
    });

    it('should focus dialog element', () => {
      const notFocusable = document.querySelector(
        '#not-focusable'
      ) as HTMLElement;
      notFocusable?.click();
      vi.advanceTimersByTime(0);
      expect(element).toBe(document.activeElement);
    });
  });
});
