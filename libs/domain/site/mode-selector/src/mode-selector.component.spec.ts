import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef, StorageService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { createEvent } from '@spryker-oryx/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { of } from 'rxjs';
import {
  modeStorageKey,
  SiteModeSelectorComponent,
} from './mode-selector.component';
import { siteModeSelectorComponent } from './mode-selector.def';

const mockAppRef = {
  findPlugin: () => ({
    getRoot: vi.fn().mockReturnValue('body'),
  }),
};

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(null));
  set = vi.fn();
}

export class RootMock extends LitElement {
  protected override render(): TemplateResult {
    console.log('render');
    return html`<root-element><slot></slot></root-element>`;
  }
}

describe('ButtonComponent', () => {
  let element: SiteModeSelectorComponent;
  let storage: MockStorageService;

  beforeAll(async () => {
    await useComponent([
      siteModeSelectorComponent,
      { name: 'root-mock', impl: RootMock },
    ]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AppRef,
          useValue: mockAppRef,
        },
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-site-mode-selector></oryx-site-mode-selector> `
    );
    storage = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the element is created', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render proper structure', () => {
      const icon = element.renderRoot.querySelector('oryx-icon');
      expect(element).toContainElement('oryx-icon-button');
      expect(element).toContainElement('button');
      expect(element).toContainElement('oryx-icon');
      expect(icon?.getAttribute('type')).toBe('mode-light');
    });
  });

  describe('when button component has been clicked', () => {
    it('should toggle icon type', async () => {
      const button = element.renderRoot.querySelector('button');
      const icon = element.renderRoot.querySelector('oryx-icon');
      expect(icon?.getAttribute('type')).toBe('mode-light');
      button?.click();
      await nextFrame();
      expect(icon?.getAttribute('type')).toBe('mode-dark');
      button?.click();
      await nextFrame();
      expect(icon?.getAttribute('type')).toBe('mode-light');
    });

    it('should toggle attribute on the root element', async () => {
      const button = element.renderRoot.querySelector('button');
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
      const icon = element.renderRoot.querySelector('oryx-icon');
      expect(icon?.getAttribute('type')).toBe('mode-light');
      window.dispatchEvent(
        createEvent(
          { type: 'oryx.toggle-mode' },
          { old: 'mode-light', mode: 'mode-dark' }
        )
      );
      await nextFrame();
      expect(icon?.getAttribute('type')).toBe('mode-dark');
      window.dispatchEvent(
        createEvent(
          { type: 'oryx.toggle-mode' },
          { old: 'mode-dark', mode: 'mode-light' }
        )
      );
      await nextFrame();
      expect(icon?.getAttribute('type')).toBe('mode-light');
    });

    it('should toggle attribute on the root element', async () => {
      window.dispatchEvent(
        createEvent(
          { type: 'oryx.toggle-mode' },
          { old: 'mode-light', mode: 'mode-dark' }
        )
      );
      await nextFrame();
      expect(document.body?.hasAttribute('mode-dark')).toBe(true);
      window.dispatchEvent(
        createEvent(
          { type: 'oryx.toggle-mode' },
          { old: 'mode-dark', mode: 'mode-light' }
        )
      );
      await nextFrame();
      expect(document.body?.hasAttribute('mode-light')).toBe(true);
      expect(document.body?.hasAttribute('mode-dark')).toBe(false);
    });
  });

  describe('when storage emits value', () => {
    it('should assign proper values', async () => {
      storage.get.mockReturnValue(of('mode-dark'));
      element = await fixture(
        html`<oryx-site-mode-selector></oryx-site-mode-selector> `
      );
      const icon = element.renderRoot.querySelector('oryx-icon');
      expect(storage.get).toHaveBeenCalledWith(modeStorageKey);
      expect(document.body?.hasAttribute('mode-light')).toBe(false);
      expect(document.body?.hasAttribute('mode-dark')).toBe(true);
      expect(icon?.getAttribute('type')).toBe('mode-dark');
    });
  });
});
