import { CSSResult } from 'lit';
import {
  ThemeData,
  ThemePlugin,
  ThemePluginName,
  ThemeStrategies,
} from './theme';

const stylesMocker = (data: unknown): CSSResult[] => [data] as CSSResult[];
const mockATheme = {
  a: {
    styles: stylesMocker('a'),
  },
  b: (): Promise<ThemeData> =>
    Promise.resolve({
      styles: stylesMocker('b'),
    }),
};

const mockBTheme = {
  a: {
    styles: stylesMocker('aA'),
  },
  b: (): Promise<ThemeData> =>
    Promise.resolve({
      styles: stylesMocker('bB'),
      strategy: ThemeStrategies.ReplaceAll,
    }),
};

const mockComponentTheme = {
  styles: stylesMocker('c'),
};

describe('ThemePlugin', () => {
  const plugin = new ThemePlugin([mockATheme, mockBTheme]);

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
  });
});
