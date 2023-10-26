import { LayoutPropertyPlugin } from '../layout.plugin';

export const BleedLayoutPluginToken = `${LayoutPropertyPlugin}bleed`;

declare global {
  export interface LayoutsProperty {
    /**
     * Components are bound inside the page bleed by default. The page bleed is
     * the space that is outside the main container size of the layout. Both the
     * maximum container width and minimum page bleed size are configurable by design tokens.
     *
     * To _break out_ the container width, the bleed flag can be used. This allows to apply
     * styling and content outside the container.
     */
    bleed?: boolean;
  }
}
