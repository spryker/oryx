import {
  CompositionLayout,
  CompositionLayoutOrientation,
} from '@spryker-oryx/experience';
import { Breakpoint } from '@spryker-oryx/utilities';

export interface LayoutAttributes
  extends LayoutProperties,
    ScreenLayoutProperties {
  orientation?: CompositionLayoutOrientation;
}

export interface LayoutProperties {
  /**
   * Layout type that is used all screen sizes.
   *
   * The layout type is used by the component logic to load the relevant styles and write
   * in the `<style></style>` property dynamically.
   *
   * Whenever a layout for a specific screen size should be used, other layout properties
   * should be used (eg `layoutSm`).
   */
  layout?: CompositionLayout;

  /**
   * Components are bound inside the page bleed by default. The page bleed is
   * the space that is outside the main container size of the layout. Both the
   * maximum container width and minimum page bleed size are configurable by design tokens.
   *
   * To _break out_ the container width, the bleed flag can be used. This allows to apply
   * styling and content outside the container.
   */
  bleed?: boolean;

  /**
   * Indicates that the composition will stick on the screen at a certain position. The position
   * defaults to 0px from the top, but can be customised using the styling. For a footer for example
   * the top can be configured to be 100%.
   */
  sticky?: boolean;
}

type ScreenLayoutProperties = {
  /**
   * Indicates layout\bleed\sticky properties per breakpoint size
   */
  [breakpoint in Breakpoint]?: LayoutProperties;
};
