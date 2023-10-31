import { LayoutPropertyPlugin } from '../../layout.plugin';

export const DividerLayoutPluginToken = `${LayoutPropertyPlugin}divider`;

declare global {
  export interface LayoutProperty {
    divider?: boolean;
  }
}
