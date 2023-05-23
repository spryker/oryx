import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { defaultIconFont } from '@spryker-oryx/ui/icon';
import {
  computed,
  fontInjectable,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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
    if (!this.icon) {
      return html``;
    }

    return this.renderer() ?? html``;
  }
}

const mockTheme = {
  getIcons: vi.fn(),
};

const mockResource = {
  getIcon: vi.fn(),
  getIcons: vi.fn(),
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
    describe('when icon font has been provided', () => {
      it('should return icon font from main resource', async () => {
        const mockResource = {
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
        mockTheme.getIcons.mockReturnValue({ resource: mockResource });
        element.icon = 'aIcon';
        await nextFrame();

        expect(element).not.toContainElement('span');
        expect(element.renderRoot.textContent).toContain(
          mockResource.mapping.aIcon.text
        );
        expect(element.style.getPropertyValue('--oryx-icon-font')).toBe(
          `"${mockResource.styles.font}"`
        );
        expect(element.style.getPropertyValue('--oryx-icon-weight')).toBe(
          `${mockResource.mapping.aIcon.styles.weight}`
        );
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
        expect(mockFontInjectable.setFont).toHaveBeenCalledWith(
          mockResource.id,
          ` 1rem '${defaultIconFont}'`
        );
        expect(element).not.toContainElement('span');
        expect(element.renderRoot.textContent).toContain(
          mockResource.mapping.bIcon
        );
      });
    });

    describe('when icon font has not been provided', () => {
      it('should return svg icon provided from resources', async () => {
        mockTheme.getIcons.mockReturnValue(undefined);
        mockResource.getIcon.mockReturnValue(
          '<div class="icon-content"></div>'
        );
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

  describe('getIcons', () => {
    it('should return the list icon of icons from ThemePlugin and ResourcePlugin', () => {
      const mockThemeIcons = {
        resource: {
          mapping: {
            a: 'a',
          },
        },
        resources: [
          {
            resource: {
              mapping: {
                b: 'b',
              },
            },
            types: ['b'],
          },
          {
            resource: {
              mapping: {
                c: 'c',
              },
            },
            types: ['c'],
          },
        ],
      };
      const mockThemeIconTypes = {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
      };
      const mockResourceIcons = { d: 'd' };
      mockTheme.getIcons.mockReturnValue(mockThemeIcons);
      mockResource.getIconTypes.mockReturnValue(mockThemeIconTypes);
      mockResource.getIcons.mockReturnValue(mockResourceIcons);
      const icons = new DefaultIconInjectable().getIcons();
      expect(icons).toEqual(Object.values(mockThemeIconTypes));
    });
  });
});
