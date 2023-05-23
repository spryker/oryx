import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { fontInjectable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ThemePlugin } from '../plugins';
import { DefaultIconInjectable } from './default-icon.injectable';

@customElement('mock-component')
class MockComponent extends LitElement {
  @property()
  icon?: string;

  protected injectable = new DefaultIconInjectable();

  render(): TemplateResult {
    if (!this.icon) {
      return html``;
    }

    return this.injectable.render(this.icon) ?? html``;
  }
}

const mockTheme = {
  getIcons: vi.fn(),
};

const mockResource = {
  getIcon: vi.fn(),
};

const mockFontInjectable = {
  setFont: vi.fn(),
};

const mockApp = {
  findPlugin: vi
    .fn()
    .mockImplementation((arg) =>
      arg === ThemePlugin ? mockTheme : mockResource
    ),
};

describe('DefaultIconInjectable', () => {
  let element: MockComponent;

  beforeEach(async () => {
    fontInjectable.inject(mockFontInjectable);

    createInjector({
      providers: [
        {
          provide: AppRef,
          useValue: mockApp,
        },
      ],
    });
    element = await fixture(html`<mock-component></mock-component>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when icon font has been provided', () => {
    it('should return icon font from main resource', async () => {
      const mockResource = {
        id: 'icon',
        styles: `font: a`,
        mapping: {
          aIcon: 'aIconContent',
          bIcon: 'bIconContent',
        },
      };
      mockTheme.getIcons.mockReturnValue({ resource: mockResource });
      element.icon = 'aIcon';
      await nextFrame();
      const iconStyles = element.renderRoot.querySelector(`style`)?.textContent;
      expect(mockFontInjectable.setFont).toHaveBeenCalledWith(mockResource.id);
      expect(element).toContainElement('style');
      expect(element.renderRoot.textContent).toContain(
        mockResource.mapping.aIcon
      );
      expect(iconStyles).toContain(`:host {${mockResource.styles}}`);
    });

    it('should return icon font from additional resource', async () => {
      const mockResource = {
        id: 'iconB',
        mapping: {
          aIcon: 'aIconContent',
          bIcon: 'bIconContent',
        },
      };
      mockTheme.getIcons.mockReturnValue({
        resource: {},
        resources: [
          {
            resource: {},
            types: ['cIcon'],
          },
          {
            resource: mockResource,
            types: ['bIcon'],
          },
        ],
      });
      element.icon = 'bIcon';
      await nextFrame();
      expect(mockFontInjectable.setFont).toHaveBeenCalledWith(mockResource.id);
      expect(element).not.toContainElement('style');
      expect(element.renderRoot.textContent).toContain(
        mockResource.mapping.bIcon
      );
    });
  });

  describe('when icon font has not been provided', () => {
    it('should return svg icon provided from resources', async () => {
      mockTheme.getIcons.mockReturnValue(undefined);
      mockResource.getIcon.mockReturnValue('<div class="icon-content"></div>');
      element.icon = 'icon';
      await nextFrame();
      expect(mockResource.getIcon).toHaveBeenCalledWith('icon');
      expect(element).toContainElement('svg');
      expect(element).toContainElement('.icon-content');
    });

    it('should return nothing if icon is not exist', async () => {
      mockTheme.getIcons.mockReturnValue(undefined);
      mockResource.getIcon.mockReturnValue(undefined);
      element.icon = 'icon';
      await nextFrame();
      expect(mockResource.getIcon).toHaveBeenCalledWith('icon');
      expect(element).not.toContainElement('svg');
    });
  });
});
