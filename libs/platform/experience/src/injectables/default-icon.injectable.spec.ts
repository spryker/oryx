import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IconTypes, defaultIconFont } from '@spryker-oryx/ui/icon';
import {
  computed,
  fontInjectable,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { ThemePlugin } from '../plugins';
import { DefaultIconInjectable } from './default-icon.injectable';

@signalAware()
@customElement('mock-component')
class MockComponent extends LitElement {
  @signalProperty() icon?: string;

  protected injectable = new DefaultIconInjectable();
  protected renderer = computed(() =>
    this.injectable.render(this.icon ?? '', this)
  );

  render(): TemplateResult {
    if (!this.icon) return html``;

    return this.renderer() ?? html``;
  }
}

const mockTheme = {
  getIcons: vi.fn(),
};

const mockResource = {
  getIconTypes: vi.fn(),
};

const mockFontInjectable = {
  setFont: vi.fn().mockReturnValue(of(true)),
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

  describe('render', () => {
    it('should return icon font from main resource', async () => {
      const mockIcons = {
        id: 'icon',
        styles: {
          font: 'a',
        },
        mapping: {
          aIcon: {
            text: 'aIconContent',
            styles: {
              weight: 300,
            },
          },
          bIcon: 'bIconContent',
        },
      };
      mockTheme.getIcons.mockReturnValue({ resource: mockIcons });
      element.icon = 'aIcon';
      await nextFrame();

      expect(element).not.toContainElement('span');
      expect(element.renderRoot.textContent).toContain(
        mockIcons.mapping.aIcon.text
      );
      expect(element.style.getPropertyValue('--oryx-icon-font')).toBe(
        `"${mockIcons.styles.font}"`
      );
      expect(element.style.getPropertyValue('--oryx-icon-weight')).toBe(
        `${mockIcons.mapping.aIcon.styles.weight}`
      );
    });

    it('should return icon font from additional resource', async () => {
      const mockIcons = {
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
            resource: mockIcons,
            types: ['bIcon'],
          },
        ],
      });
      element.icon = 'bIcon';
      await nextFrame();
      expect(mockFontInjectable.setFont).toHaveBeenCalledWith(
        mockIcons.id,
        ` 1rem '${defaultIconFont}'`
      );
      expect(element).not.toContainElement('span');
      expect(element.renderRoot.textContent).toContain(mockIcons.mapping.bIcon);
    });

    it('should return svg icon template', async () => {
      const mockIcons = {
        id: 'iconSvg',
        svg: true,
        mapping: {
          icon: '<div class="icon-content"></div>',
        },
      };
      mockTheme.getIcons.mockReturnValue({ resource: mockIcons });
      element.icon = 'aIcon';
      element.icon = 'icon';
      await nextFrame();
      expect(element).toContainElement('svg');
      expect(element).toContainElement('.icon-content');
    });
  });

  describe('getIcons', () => {
    it('should return the list icon of icons from ThemePlugin and ResourcePlugin', () => {
      expect(new DefaultIconInjectable().getIcons()).toEqual(
        Object.values(IconTypes)
      );
    });
  });
});
