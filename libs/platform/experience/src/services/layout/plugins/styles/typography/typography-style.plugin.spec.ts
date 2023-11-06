import { lastValueFrom } from 'rxjs';
import { TypographyStylePlugin } from './typography-style.plugin';

describe('TypographyStylePlugin', () => {
  let plugin: TypographyStylePlugin;

  beforeEach(() => {
    plugin = new TypographyStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./typography-style.schema').then(
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
      const result = await lastValueFrom(
        plugin.getStyleProperties({ styles: data, options: {} })
      );

      expect(result).toEqual(styleProperties);
    });
  });
});
