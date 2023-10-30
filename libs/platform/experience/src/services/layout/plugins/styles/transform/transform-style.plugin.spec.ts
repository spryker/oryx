import { lastValueFrom } from 'rxjs';
import { TransformStylePlugin } from './transform-style.plugin';

describe('TransformStylePlugin', () => {
  let plugin: TransformStylePlugin;

  beforeEach(() => {
    plugin = new TransformStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./transform-style.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutStyleProperties object', async () => {
      const data = { scale: 1.5, rotate: 60 };
      const styleProperties = [
        [{ rotate: data.rotate }, { unit: 'deg' }],
        [{ scale: data.scale }],
      ];
      const result = await lastValueFrom(plugin.getStyleProperties(data));

      expect(result).toEqual(styleProperties);
    });
  });
});
