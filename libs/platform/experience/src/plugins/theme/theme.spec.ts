import { DefaultMedia, rootInjectable, Size } from '@spryker-oryx/utilities';
import { css, CSSResult } from 'lit';
import { ThemePlugin, ThemePluginName } from './theme';
import { Theme, ThemeStrategies, ThemeStyles } from './theme.model';

const stylesMocker = (data: unknown): CSSResult[] => [data] as CSSResult[];
const mockATheme: Theme = {
  name: 'b',
  icons: {
    resource: { id: 'a', mapping: { a: 'a' } },
    resources: [
      {
        resource: { id: 'b', mapping: { a: 'b' } },
        types: ['a', 'b'],
      },
    ],
  },
};

const mockBTheme: Theme = {
  name: 'a',
  icons: {
    resource: { id: 'c', mapping: { a: 'c' } },
    resources: [
      {
        resource: { id: 'd', mapping: { a: 'd' } },
        types: ['a', 'b'],
      },
    ],
  },
};

const mockATokensTheme = {
  designTokens: [
    {
      color: {
        blue: {
          light: {
            100: '1',
            200: '2',
          },
          dark: {
            100: '2',
            200: '1',
          },
        },
      },
    },
    {
      media: {
        mode: 'dark',
      },
      color: {
        red: 'red1',
      },
    },
  ],
} as unknown as Theme;

const mockBTokensTheme = {
  designTokens: [
    {
      long: {
        nested: {
          property: {
            key: 'value',
          },
        },
        key: 'value',
      },
      'one-line': 'value',
    },
  ],
} as unknown as Theme;

const mockComponentPlugin = {
  getOptions: vi.fn().mockReturnValue({}),
};

const mockApp = {
  findPlugin: vi.fn(),
  requirePlugin: vi.fn().mockReturnValue(mockComponentPlugin),
  registerPlugin: vi.fn(),
  whenReady: vi.fn(),
  markReady: vi.fn(),
  destroy: vi.fn(),
};

describe('ThemePlugin', () => {
  const plugin = new ThemePlugin([mockATheme, mockBTheme]);

  describe('getName', () => {
    it('should return proper name', () => {
      expect(plugin.getName()).toBe(ThemePluginName);
    });
  });

  describe('resolve', () => {
    it('should resolve common styles', async () => {
      const expected = [['a'], ['aA']];
      const themeData = await plugin.resolve({
        name: 'a',
        stylesheets: [
          {
            rules: stylesMocker('a'),
          },
          {
            rules: stylesMocker('aA'),
          },
        ],
      } as ComponentDef);

      expect(themeData).toEqual(expected);
    });

    it('should resolve theme data by themeName', async () => {
      const expected = [{ styles: ['a'] }, { styles: ['aA'] }];
      const themeData = await plugin.resolve({
        name: 'a',
        stylesheets: [
          {
            theme: 'a',
            rules: {
              styles: stylesMocker('a'),
            },
          },
          {
            theme: 'a',
            rules: {
              styles: stylesMocker('aA'),
            },
          },
        ],
      } as ComponentDef);

      expect(themeData).toEqual(expected);
    });

    it('should resolve theme lazyloadable data by themeName', async () => {
      const expected = [
        { styles: ['b'] },
        { styles: ['bB'], strategy: 'replace-all' },
      ];
      const themeData = await plugin.resolve({
        name: 'b',
        stylesheets: [
          {
            theme: 'b',
            rules: (): Promise<ThemeStyles> =>
              Promise.resolve({
                styles: stylesMocker('b'),
              }),
          },
          {
            theme: 'b',
            rules: (): Promise<ThemeStyles> =>
              Promise.resolve({
                styles: stylesMocker('bB'),
                strategy: ThemeStrategies.ReplaceAll,
              }),
          },
        ],
      } as ComponentDef);
      expect(themeData).toEqual(expected);
    });

    describe('when design tokens have been set', () => {
      const plugin = new ThemePlugin([
        { ...mockATheme, ...mockATokensTheme },
        { ...mockBTheme, ...mockBTokensTheme },
      ]);

      it('should resolve theme with parsed design token and global styles', async () => {
        rootInjectable.inject('a');
        const expectedHostStyles = `
          :host {--oryx-one-line: value;--oryx-long-key: value;--oryx-long-nested-property-key: value;}
          @media (prefers-color-scheme: dark) { @layer mode.light, mode.dark; }
          @layer mode.dark { [mode-dark],:host(:not([mode-light])) {--oryx-color-red: red1;--oryx-color-blue-100: 2;--oryx-color-blue-200: 1;}}
          @media (prefers-color-scheme: light) { @layer mode.dark, mode.light; }
          @layer mode.light { [mode-light],:host(:not([mode-dark])) {--oryx-color-blue-100: 1;--oryx-color-blue-200: 2;}}
        `
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/\s+/g, ' ')
          .trim();
        const expected = [
          {
            styles: ` ${expectedHostStyles}`,
          },
          { styles: ['a'] },
          { styles: ['aA'] },
        ];
        mockApp.requirePlugin.mockReturnValueOnce(mockComponentPlugin);
        const themeData = await plugin.resolve({
          name: 'a',
          stylesheets: [
            {
              theme: 'a',
              rules: {
                styles: stylesMocker('a'),
              },
            },
            {
              theme: 'a',
              rules: {
                styles: stylesMocker('aA'),
              },
            },
          ],
        } as ComponentDef);
        expect(themeData).toEqual(expected);
      });
    });
  });

  describe('apply', () => {
    describe('when design tokens have been set', () => {
      const plugin = new ThemePlugin([
        { ...mockATheme, ...mockATokensTheme },
        { ...mockBTheme, ...mockBTokensTheme },
      ]);

      it('should add parsed design tokens to the document.body if components plugin root options is string', async () => {
        const expected = `
          :root {--oryx-one-line: value;--oryx-long-key: value;--oryx-long-nested-property-key: value;}
          @media (prefers-color-scheme: dark) { @layer mode.light, mode.dark; }
          @layer mode.dark { [mode-dark],:root {--oryx-color-red: red1;--oryx-color-blue-100: 2;--oryx-color-blue-200: 1;}}
          @media (prefers-color-scheme: light) { @layer mode.dark, mode.light; }
          @layer mode.light { [mode-light],:root {--oryx-color-blue-100: 1;--oryx-color-blue-200: 2;}}
        `
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/\s+/g, ' ')
          .trim();
        mockComponentPlugin.getOptions.mockReturnValue({
          root: 'root',
        });
        mockApp.requirePlugin.mockReturnValueOnce(mockComponentPlugin);
        await plugin.apply(mockApp);
        const styles = document.body
          .querySelector('style')
          ?.textContent?.trim();
        expect(styles).toBe(expected);
      });
    });
  });

  describe('normalizeStyles', () => {
    it('should return array of CSSResult instances if argument is string', () => {
      const result = plugin.normalizeStyles('s');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CSSResult);
      expect(result[0].toString()).toBe('s');
    });

    it('should return array of CSSResult instances if argument is CSSResult', () => {
      const result = plugin.normalizeStyles(css`s`);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CSSResult);
      expect(result[0].toString()).toBe('s');
    });

    it('should return array of CSSResult instances if argument is CSSResult[]', () => {
      const result = plugin.normalizeStyles([css`s`, css`a`]);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CSSResult);
      expect(result[0].toString()).toBe('s');
      expect(result[1]).toBeInstanceOf(CSSResult);
      expect(result[1].toString()).toBe('a');
    });

    describe('when breakpoints has been set', () => {
      const mockABreakpointsTheme: Theme = {
        breakpoints: {
          [Size.Lg]: {
            min: 600,
          },
          [Size.Sm]: {
            min: 200,
            max: 400,
          },
        },
        ...mockATheme,
      };
      const plugin = new ThemePlugin([mockABreakpointsTheme]);

      it('should return array of CSSResult instances with styles with breakpoints', () => {
        const result = plugin.normalizeStyles([
          {
            media: {
              [DefaultMedia.Screen]: Size.Sm,
            },
            css: 'a',
          },
          {
            media: {
              [DefaultMedia.Screen]: Size.Lg,
            },
            css: [css`k`, css`l`],
          },
        ]);
        const styles = result[0]
          .toString()
          .trim()
          .replace(/(?:\r\n|\r|\n)/g, '');

        const expected =
          '@media (min-width: 200px) and (max-width: 400px) { a} @media (min-width: 600px) { k l}';

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toBeInstanceOf(CSSResult);
        expect(styles).toBe(expected);
      });
    });
  });

  describe('generateScreenMedia', () => {
    const breakpoints = {
      xs: {
        min: 0,
        max: 399,
      },
      [Size.Sm]: {
        min: 400,
        max: 599,
      },
      [Size.Md]: {
        min: 600,
        max: 999,
      },
      [Size.Lg]: {
        min: 1000,
        max: 1200,
      },
      xl: {
        min: 1201,
      },
    };
    const mockABreakpointsTheme = {
      breakpoints,
      ...mockATheme,
    } as Theme;
    const plugin = new ThemePlugin([mockABreakpointsTheme]);

    it('should not include media with 0 start point', () => {
      const a = plugin.generateScreenMedia('xs');
      expect(a).toBe(`@media (max-width: ${breakpoints.xs.max}px)`);
    });

    it('should generate proper media for single media', () => {
      const a = plugin.generateScreenMedia('md');
      expect(a).toBe(
        `@media (min-width: ${breakpoints.md.min}px) and (max-width: ${breakpoints.md.max}px)`
      );
    });

    it('should not include media with max value without end point', () => {
      const a = plugin.generateScreenMedia('xl');
      expect(a).toBe(`@media (min-width: ${breakpoints.xl.min}px)`);
    });

    it('should generate proper media for array of medias', () => {
      const a = plugin.generateScreenMedia(['xs', 'sm']);
      expect(a).toBe(`@media (max-width: ${breakpoints.sm.max}px)`);
      const b = plugin.generateScreenMedia(['sm', 'md']);
      expect(b).toBe(
        `@media (min-width: ${breakpoints.sm.min}px) and (max-width: ${breakpoints.md.max}px)`
      );
      const c = plugin.generateScreenMedia(['sm', 'lg']);
      expect(c).toBe(
        `@media (min-width: ${breakpoints.sm.min}px) and (max-width: ${breakpoints.sm.max}px), (min-width: ${breakpoints.lg.min}px) and (max-width: ${breakpoints.lg.max}px)`
      );
      const d = plugin.generateScreenMedia(['xs', 'sm', 'lg', 'xl']);
      expect(d).toBe(
        `@media (max-width: ${breakpoints.sm.max}px), (min-width: ${breakpoints.lg.min}px)`
      );
      const e = plugin.generateScreenMedia(['xs', 'md', 'xl']);
      expect(e).toBe(
        `@media (max-width: ${breakpoints.xs.max}px), (min-width: ${breakpoints.md.min}px) and (max-width: ${breakpoints.md.max}px), (min-width: ${breakpoints.xl.min}px)`
      );
      const g = plugin.generateScreenMedia(['md', 'lg']);
      expect(g).toBe(
        `@media (min-width: ${breakpoints.md.min}px) and (max-width: ${breakpoints.lg.max}px)`
      );
    });

    it('should exclude proper media from array of medias', () => {
      const a = plugin.generateScreenMedia([], ['lg']);
      expect(a).toBe(
        `@media (max-width: ${breakpoints.md.max}px), (min-width: ${breakpoints.xl.min}px)`
      );
      const b = plugin.generateScreenMedia([], ['xs', 'sm', 'xl']);
      expect(b).toBe(
        `@media (min-width: ${breakpoints.md.min}px) and (max-width: ${breakpoints.lg.max}px)`
      );
      const c = plugin.generateScreenMedia([], ['xs', 'md', 'xl']);
      expect(c).toBe(
        `@media (min-width: ${breakpoints.sm.min}px) and (max-width: ${breakpoints.sm.max}px), (min-width: ${breakpoints.lg.min}px) and (max-width: ${breakpoints.lg.max}px)`
      );
    });

    it('should generate proper media with both values', () => {
      const a = plugin.generateScreenMedia(['sm'], ['sm', 'xl']);
      expect(a).toBe(`@media (max-width: ${breakpoints.lg.max}px)`);
      const b = plugin.generateScreenMedia(['sm', 'md'], ['sm', 'lg']);
      expect(b).toBe(
        `@media (max-width: ${breakpoints.md.max}px), (min-width: ${breakpoints.xl.min}px)`
      );
      const c = plugin.generateScreenMedia(['sm'], ['xs', 'sm', 'lg', 'xl']);
      expect(c).toBe(
        `@media (min-width: ${breakpoints.sm.min}px) and (max-width: ${breakpoints.md.max}px)`
      );
    });

    it('should return null if both parameters are empty arrays', () => {
      const a = plugin.generateScreenMedia([], []);
      expect(a).toBeNull();
    });
  });

  describe('getIcons', () => {
    it('should return proper icons list', () => {
      const icons = plugin.getIcons();
      expect(icons).toEqual({
        resource: mockBTheme.icons?.resource,
        resources: [
          ...(mockBTheme.icons?.resources ?? []),
          ...(mockATheme.icons?.resources ?? []),
        ],
      });
    });
  });

  describe('getBreakpoints', () => {
    const mockABreakpointsTheme: Theme = {
      breakpoints: {
        [Size.Lg]: {
          min: 600,
        },
        [Size.Sm]: {
          min: 200,
          max: 400,
        },
      },
      ...mockATheme,
    };
    const mockBBreakpointsTheme: Theme = {
      breakpoints: {
        [Size.Sm]: {
          min: 250,
          max: 350,
        },
        [Size.Xs]: {
          max: 200,
        },
      },
      ...mockBTheme,
    };
    const plugin = new ThemePlugin([
      mockABreakpointsTheme,
      mockBBreakpointsTheme,
    ]);

    it('should return sorted breakpoints list', () => {
      const breakpoints = plugin.getBreakpoints();
      expect(breakpoints).toStrictEqual({
        xs: { max: 200 },
        sm: { min: 250, max: 350 },
        lg: { min: 600 },
      });
    });
  });
});
