import { IMAGE_FIT, IMAGE_POSITION } from '@spryker-oryx/ui';
import { lastValueFrom } from 'rxjs';
import { ObjectFit } from './image-style.model';
import { ImageStylePlugin } from './image-style.plugin';

describe('ImageStylePlugin', () => {
  let plugin: ImageStylePlugin;

  beforeEach(() => {
    plugin = new ImageStylePlugin();
  });

  describe('getConfig', () => {
    it('should return proper schema in the object', async () => {
      const schema = await import('./image-style.schema').then(
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
        imageFit: ObjectFit.Cover,
        imagePosition: 'center',
      };
      const styleProperties = {
        [IMAGE_FIT]: ObjectFit.Cover,
        [IMAGE_POSITION]: 'center',
      };
      const result = await lastValueFrom(
        plugin.getStyleProperties({ styles: data, options: {} })
      );

      expect(result).toEqual(styleProperties);
    });
  });
});
