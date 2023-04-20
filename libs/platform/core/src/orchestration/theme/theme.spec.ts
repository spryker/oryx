import { Size } from '@spryker-oryx/utilities';
import { css, CSSResult } from 'lit';
import { ComponentDef } from '../components';
import { ThemePlugin, ThemePluginName } from './theme';
import {
  Theme,
  ThemeData,
  ThemeDefaultMedia,
  ThemeStrategies,
} from './theme.model';

const stylesMocker = (data: unknown): CSSResult[] => [data] as CSSResult[];
const mockATheme: Theme = {
  name: 'b',
};

const mockBTheme: Theme = {
  name: 'a',
};

const mockComponentPlugin = {
  getOptions: vi.fn().mockReturnValue({}),
  getRoot: vi.fn(),
};

const mockApp = {
  findPlugin: vi.fn().mockReturnValue(mockComponentPlugin),
  requirePlugin: vi.fn(),
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
            rules: (): Promise<ThemeData> =>
              Promise.resolve({
                styles: stylesMocker('b'),
              }),
          },
          {
            theme: 'b',
            rules: (): Promise<ThemeData> =>
              Promise.resolve({
                styles: stylesMocker('bB'),
                strategy: ThemeStrategies.ReplaceAll,
              }),
          },
        ],
      } as ComponentDef);
      expect(themeData).toEqual(expected);
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
  });

  describe('when icons has been set', () => {
    const mockAIconTheme: Theme = {
      ...mockATheme,
      icons: {
        a: 'a',
      },
    };
    const mockBIconTheme: Theme = {
      ...mockBTheme,
      icons: {
        b: (): Promise<string> => Promise.resolve('b'),
      },
    };
    const plugin = new ThemePlugin([mockAIconTheme, mockBIconTheme]);

    beforeEach(() => {
      plugin.apply(mockApp);
    });

    describe('getIcon', () => {
      it('should resolve icon by name', async () => {
        await plugin.apply(mockApp);
        const iconA = await plugin.getIcon('a');
        expect(iconA).toBe('a');
        const iconB = await plugin.getIcon('b');
        expect(iconB).toBe('b');
        const iconC = await plugin.getIcon('c');
        expect(iconC).toBeUndefined();
      });
    });
  });

  describe('when design tokens have been set', () => {
    const mockATokensTheme: Theme = {
      designTokens: [
        {
          color: {
            red: 'red',
            blue: {
              100: '1',
              200: '2',
              300: '3',
              400: '4',
              500: '5',
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
      ...mockATheme,
    };
    const mockBTokensTheme: Theme = {
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
      ...mockBTheme,
    };
    // TODO: fix `Could not parse CSS stylesheet` error
    const expectedStyles = (selector = ':host'): string =>
      ` ${selector} {--oryx-one-line: value;--oryx-long-key: value;--oryx-long-nested-property-key: value;} @media (prefers-color-scheme: dark) { @layer mode.light, mode.dark; } @layer mode.dark { [mode-dark],${selector}(:not([mode-light])) {--oryx-color-red: red1;}} @media (prefers-color-scheme: light) { @layer mode.dark, mode.light; } @layer mode.light { [mode-light],${selector}(:not([mode-dark])) {--oryx-color-red: red;--oryx-color-blue-100: 1;--oryx-color-blue-200: 2;--oryx-color-blue-300: 3;--oryx-color-blue-400: 4;--oryx-color-blue-500: 5;}}`;
    const plugin = new ThemePlugin([mockATokensTheme, mockBTokensTheme]);

    describe('resolve', () => {
      it('should resolve theme with parsed design token and global styles', async () => {
        mockComponentPlugin.getRoot.mockReturnValue('a');

        const expected = [{ styles: ['a'] }, { styles: ['aA'] }];
        mockApp.findPlugin.mockReturnValueOnce(mockComponentPlugin);
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

        expect(themeData).toEqual(expect.arrayContaining(expected));
      });
    });

    describe('apply', () => {
      it('should add parsed design tokens to the document.body if components plugin root options is string', async () => {
        mockComponentPlugin.getOptions.mockReturnValue({
          root: 'root',
        });
        mockApp.findPlugin.mockReturnValueOnce(mockComponentPlugin);
        await plugin.apply(mockApp);
        const styles = document.body
          .querySelector('style')
          ?.textContent?.trim();
        expect(styles).toContain(':root');
      });
    });
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

    describe('normalizeStyles', () => {
      it('should return array of CSSResult instances with styles with breakpoints', () => {
        const result = plugin.normalizeStyles([
          {
            media: {
              [ThemeDefaultMedia.Screen]: Size.Sm,
            },
            css: 'a',
          },
          {
            media: {
              [ThemeDefaultMedia.Screen]: Size.Lg,
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
});
