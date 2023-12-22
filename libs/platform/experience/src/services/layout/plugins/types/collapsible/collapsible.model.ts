import { HeadingTag } from '@spryker-oryx/ui/heading';
import { LayoutPlugin } from '../../layout.plugin';

export const CollapsibleLayoutPluginToken = `${LayoutPlugin}collapsible`;

declare global {
  export interface Layouts {
    collapsible: undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends CollapsibleLayoutProperties {}
}

export interface CollapsibleLayoutProperties {
  collapsePerComponent?: boolean;
  collapsibleOpen?: boolean;
  collapsibleTag?: HeadingTag;
  collapsibleTypography?: HeadingTag;
}
