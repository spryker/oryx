import { lastValueFrom } from 'rxjs';
import { TypographyLayoutPlugin } from './typography-layout.plugin';

describe('TypographyLayoutPlugin', () => {
  let plugin: TypographyLayoutPlugin;

  beforeEach(() => {
    plugin = new TypographyLayoutPlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./typography-layout.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutStyleProperties object', async () => {
      const data = { typography: 'small' };
      const styleProperties = {
        'font-size': `var(--oryx-typography-${data.typography}-size)`,
        'font-weight': `var(--oryx-typography-${data.typography}-weight)`,
        'line-height': `var(--oryx-typography-${data.typography}-line)`,
      };
      const result = await lastValueFrom(plugin.getStyleProperties(data));

      expect(result).toEqual(styleProperties);
    });
  });
});
