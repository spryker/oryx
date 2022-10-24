import { HOOKS_KEY, IconHookToken } from '@spryker-oryx/utilities';
import { css, CSSResult } from 'lit';
import { ThemePlugin, ThemePluginName } from './theme';
import { Theme, ThemeData, ThemeStrategies } from './theme.model';

const stylesMocker = (data: unknown): CSSResult[] => [data] as CSSResult[];
const mockATheme: Theme = {
  globalStyles: 'globalA',
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
      mediaQuery: {
        mode: 'dark',
      },
      color: {
        red: 'red1',
      },
    },
  ],
  icons: {
    a: 'a',
    b: (): Promise<string> => Promise.resolve('b'),
  },
  components: {
    a: {
      styles: stylesMocker('a'),
    },
    b: (): Promise<ThemeData> =>
      Promise.resolve({
        styles: stylesMocker('b'),
      }),
  },
};

const mockBTheme: Theme = {
  globalStyles: 'globalB',
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
  components: {
    a: {
      styles: stylesMocker('aA'),
    },
    b: (): Promise<ThemeData> =>
      Promise.resolve({
        styles: stylesMocker('bB'),
        strategy: ThemeStrategies.ReplaceAll,
      }),
  },
};

const mockComponentTheme = {
  styles: stylesMocker('c'),
};

const mockComponentPlugin = {
  options: {
    [HOOKS_KEY]: {
      [IconHookToken]: 'IconHookToken',
    } as Record<string, string>,
  },
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

  beforeEach(() => {
    plugin.beforeApply(mockApp);
  });

  describe('getName', () => {
    it('should return proper name', () => {
      expect(plugin.getName()).toBe(ThemePluginName);
    });
  });

  describe('resolve', () => {
    it('should resolve theme data by tag name', async () => {
      const expected = [{ styles: ['a'] }, { styles: ['aA'] }];
      const themeData = await plugin.resolve('a');
      expect(themeData).toEqual(expected);
    });

    it('should resolve theme data by tag name with additional theme implementation', async () => {
      const expected = [
        { styles: ['b'] },
        { styles: ['bB'], strategy: 'replace-all' },
        { styles: ['c'] },
      ];
      const themeData = await plugin.resolve('b', mockComponentTheme);
      expect(themeData).toEqual(expected);
    });

    it('should not override IconHookToken for ComponentsPlugin if its defined', async () => {
      await plugin.resolve('a');
      expect(mockComponentPlugin.options[HOOKS_KEY][IconHookToken]).toBe(
        'IconHookToken'
      );
    });

    it('should define IconHookToken for ComponentsPlugin if its not defined', async () => {
      const mockComponentPlugin = {
        options: {
          [HOOKS_KEY]: {
            anotherToken: 'anotherToken',
          } as Record<string, string>,
        },
      };
      mockApp.findPlugin.mockReturnValueOnce(mockComponentPlugin);
      await plugin.resolve('a');
      expect(mockComponentPlugin.options[HOOKS_KEY].anotherToken).toBe(
        'anotherToken'
      );
      expect(typeof mockComponentPlugin.options[HOOKS_KEY][IconHookToken]).toBe(
        'function'
      );
    });

    it('should resolve theme with parsed design token and global styles', async () => {
      const mockComponentPlugin = {
        rootSelector: 'a',
        options: {},
      };
      const expected = [
        {
          styles:
            'globalAglobalB:host {--oryx-color-red: red;--oryx-color-blue-100: 1;--oryx-color-blue-200: 2;--oryx-color-blue-300: 3;--oryx-color-blue-400: 4;--oryx-color-blue-500: 5;}@media (prefers-color-scheme: dark) {:host {--oryx-color-red: red1;}}:host {--oryx-one-line: value;--oryx-long-key: value;--oryx-long-nested-property-key: value;}',
        },
        { styles: ['a'] },
        { styles: ['aA'] },
      ];
      mockApp.findPlugin.mockReturnValueOnce(mockComponentPlugin);
      const themeData = await plugin.resolve('a');
      expect(themeData).toEqual(expected);
    });
  });

  describe('apply', () => {
    it('should add parsed design tokens and global styles to the document.body if components plugin root options is string', async () => {
      const mockComponentPlugin = {
        options: {
          root: 'root',
        },
      };
      const expected =
        'globalAglobalB:root:not([no-dark-mode]) {--oryx-color-red: red;--oryx-color-blue-100: 1;--oryx-color-blue-200: 2;--oryx-color-blue-300: 3;--oryx-color-blue-400: 4;--oryx-color-blue-500: 5;}:root:not([no-dark-mode]) {--oryx-color-red: red1;}:root:not([no-dark-mode]) {--oryx-one-line: value;--oryx-long-key: value;--oryx-long-nested-property-key: value;}';
      mockApp.findPlugin.mockReturnValueOnce(mockComponentPlugin);
      await plugin.apply();
      const styles = document.body.querySelector('style')?.textContent?.trim();
      expect(styles).toBe(expected);
    });
  });

  describe('transformer', () => {
    it('should return array of CSSResult instances if argument is string', () => {
      const result = plugin.transformer('s');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CSSResult);
      expect(result[0].toString()).toBe('s');
    });

    it('should return array of CSSResult instances if argument is CSSResult', () => {
      const result = plugin.transformer(css`s`);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CSSResult);
      expect(result[0].toString()).toBe('s');
    });

    it('should return array of CSSResult instances if argument is CSSResult[]', () => {
      const result = plugin.transformer([css`s`, css`a`]);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CSSResult);
      expect(result[0].toString()).toBe('s');
      expect(result[1]).toBeInstanceOf(CSSResult);
      expect(result[1].toString()).toBe('a');
    });
  });

  describe('getIcon', () => {
    it('should resolve icon by name', async () => {
      await plugin.resolve('a');
      const iconA = await plugin.getIcon('a');
      expect(iconA).toBe('a');
      const iconB = await plugin.getIcon('b');
      expect(iconB).toBe('b');
      const iconC = await plugin.getIcon('c');
      expect(iconC).toBeUndefined();
    });
  });

  describe('getIconTemplate', () => {
    it('should return icon template', async () => {
      await plugin.resolve('a');
      const iconA = await plugin.getIconTemplate('a');
      expect(iconA).toBe('a');
      const iconB = await plugin.getIconTemplate('b');
      expect(iconB).toBe(mockATheme.icons?.b);
      const iconC = await plugin.getIconTemplate('c');
      expect(iconC).toBeUndefined();
    });
  });
});
