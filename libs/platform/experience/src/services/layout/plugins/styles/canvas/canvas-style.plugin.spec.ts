import { lastValueFrom } from 'rxjs';
import { CanvasStylePlugin } from './canvas-style.plugin';

describe('CanvasStylePlugin', () => {
  let plugin: CanvasStylePlugin;

  beforeEach(() => {
    plugin = new CanvasStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./canvas-style.schema').then(
        (module) => module.schema
      );
      const config = await lastValueFrom(plugin.getConfig?.());
      const result = await (config.schema as () => unknown)();

      expect(result).toEqual(schema);
    });
  });

  describe('getStyleProperties', () => {
    it('should return a LayoutStyleProperties object', async () => {
      const data = {
        radius: 'radius',
        border: 'border',
        background: 'background',
        fill: 'fill',
      };
      const styleProperties = {
        border: data.border,
        'border-radius': data.radius,
        background: data.background,
        '--oryx-fill': data.fill,
      };
      const result = await lastValueFrom(plugin.getStyleProperties(data));

      expect(result).toEqual(styleProperties);
    });
  });
});
