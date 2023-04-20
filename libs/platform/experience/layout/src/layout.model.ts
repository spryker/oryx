import {
  CompositionLayout,
  CompositionLayoutOrientation,
} from '../../src/models';

export interface LayoutAttributes {
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
  layoutXs?: CompositionLayout;
  layoutSm?: CompositionLayout;
  layoutMd?: CompositionLayout;
  layoutLg?: CompositionLayout;
  layoutXl?: CompositionLayout;

  /**
   * Components are bound inside the page bleed by default. The page bleed is
   * the space that is outside the main container size of the layout. Both the
   * maximum container width and minimum page bleed size are configurable by design tokens.
   *
   * To _break out_ the container width, the bleed flag can be used. This allows to apply
   * styling and content outside the container.
   */
  bleed?: boolean;
  bleedXs?: boolean;
  bleedSm?: boolean;
  bleedMd?: boolean;
  bleedLg?: boolean;
  bleedXl?: boolean;

  /**
   * Indicates that the composition will stick on the screen at a certain position. The position
   * defaults to 0px from the top, but can be customised using the styling. For a footer for example
   * the top can be configured to be 100%.
   */
  sticky?: boolean;
  stickyXs?: boolean;
  stickySm?: boolean;
  stickyMd?: boolean;
  stickyLg?: boolean;
  stickyXl?: boolean;

  orientation?: CompositionLayoutOrientation;
}
