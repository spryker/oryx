import { LayoutPropertyPlugin } from '../../layout.plugin';

export const ShadowLayoutPluginToken = `${LayoutPropertyPlugin}shadow`;

declare global {
  export interface LayoutProperty {
    /**
     * Allows to set a shadow to the element.
     */
    shadow?: boolean;
  }
}
