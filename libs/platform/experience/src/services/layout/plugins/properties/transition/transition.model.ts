import { LayoutPropertyPlugin } from '../../layout.plugin';

export const TransitionLayoutPluginToken = `${LayoutPropertyPlugin}transition`;

declare global {
  export interface LayoutProperty {
    transition?: boolean;
  }
}
