import { createEvent } from '@/tools/testing';
import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorMode, useComponent } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import {
  ColorModeSelectorComponent,
  EVENT_TOGGLE_COLOR,
} from './color-mode-selector.component';
import { colorModeSelectorComponent } from './color-mode-selector.def';

export class RootMock extends LitElement {
  protected override render(): TemplateResult {
    return html`<root-element><slot></slot></root-element>`;
  }
}

let triggerMatcher: () => void;
const darkMode = { match: false };

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: darkMode.match,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (type: string, cb: () => void) => (triggerMatcher = cb),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ColorModeSelectorComponent', () => {
  let element: ColorModeSelectorComponent;

  beforeAll(async () => {
    await useComponent([
      colorModeSelectorComponent,
      { name: 'root-mock', impl: RootMock },
    ]);
  });

  beforeEach(async () => {
    document.body?.removeAttribute(ColorMode.Dark);
    document.body?.removeAttribute(ColorMode.Light);

    element = await fixture(
      html`<oryx-color-mode-selector></oryx-color-mode-selector> `
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the element is created', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render proper structure', () => {
      const button = element.renderRoot.querySelector('oryx-button');
      expect(button).toHaveProperty('icon', IconTypes.ModeDark);
    });
  });

  describe('when button component has been clicked', async () => {
    it('should toggle icon type', async () => {
      const button =
        element.renderRoot.querySelector<HTMLElement>('oryx-button');
      expect(button).toHaveProperty('icon', IconTypes.ModeDark);
      button?.click();
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeLight);
      button?.click();
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeDark);
    });

    it('should toggle attribute on the root element', async () => {
      const button =
        element.renderRoot.querySelector<HTMLElement>('oryx-button');
      button?.click();
      await nextFrame();
      expect(document.body?.hasAttribute('mode-dark')).toBe(true);
      button?.click();
      await nextFrame();
      expect(document.body?.hasAttribute('mode-light')).toBe(true);
      expect(document.body?.hasAttribute('mode-dark')).toBe(false);
    });
  });

  describe('when `oryx.toggle-mode` event has been dispatched', () => {
    it('should toggle icon type', async () => {
      const button =
        element.renderRoot.querySelector<HTMLElement>('oryx-button');
      expect(button).toHaveProperty('icon', IconTypes.ModeDark);
      window.dispatchEvent(
        createEvent(
          { type: EVENT_TOGGLE_COLOR },
          { old: 'mode-light', mode: 'mode-dark' }
        )
      );
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeLight);
      window.dispatchEvent(
        createEvent(
          { type: EVENT_TOGGLE_COLOR },
          { old: 'mode-dark', mode: 'mode-light' }
        )
      );
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeDark);
    });

    it('should toggle attribute on the root element', async () => {
      window.dispatchEvent(
        createEvent(
          { type: EVENT_TOGGLE_COLOR },
          { old: ColorMode.Light, mode: ColorMode.Dark }
        )
      );
      await nextFrame();
      expect(document.body?.hasAttribute(ColorMode.Dark)).toBe(true);
      window.dispatchEvent(
        createEvent(
          { type: EVENT_TOGGLE_COLOR },
          { old: ColorMode.Dark, mode: ColorMode.Light }
        )
      );
      await nextFrame();
      expect(document.body?.hasAttribute(ColorMode.Light)).toBe(true);
      expect(document.body?.hasAttribute(ColorMode.Dark)).toBe(false);
    });
  });

  describe('when mode has been change thought browser', () => {
    it('should change icon type', async () => {
      const button =
        element.renderRoot.querySelector<HTMLElement>('oryx-button');
      darkMode.match = false;
      triggerMatcher();
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeDark);
      darkMode.match = true;
      triggerMatcher();
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeLight);
      darkMode.match = false;
    });

    it('should not change icon type if root element has attribute', async () => {
      const button =
        element.renderRoot.querySelector<HTMLElement>('oryx-button');
      button?.click();
      await nextFrame();
      expect(document.body?.hasAttribute(ColorMode.Dark)).toBe(true);
      expect(button).toHaveProperty('icon', IconTypes.ModeLight);
      darkMode.match = false;
      triggerMatcher();
      await nextFrame();
      expect(button).toHaveProperty('icon', IconTypes.ModeLight);
    });
  });
});
