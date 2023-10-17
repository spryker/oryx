import { LayoutPropertyPlugin } from '../layout.plugin';

export const DividerLayoutPluginToken = `${LayoutPropertyPlugin}divider`;

declare global {
  export interface LayoutsProperty {
    divider?: boolean;
  }
}
