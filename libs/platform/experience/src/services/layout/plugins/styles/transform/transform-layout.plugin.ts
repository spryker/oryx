import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class TransformLayoutPlugin implements LayoutPlugin {
  getConfig(): LayoutPluginConfig {
    return {
      schema: () => import('./transform-layout.schema').then((m) => m.schema),
    };
  }

  getStyleProperties(data: LayoutStyleParameters): LayoutStyleProperties {
    return [
      [{ rotate: data.rotate }, { unit: 'deg' }],
      [{ scale: data.scale }],
    ];
  }
}
