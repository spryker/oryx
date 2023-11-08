import {
  CompositionLayout,
  CompositionLayoutOrientation,
  LayoutTypes,
} from '@spryker-oryx/experience';
import { Breakpoint } from '@spryker-oryx/utilities';

export interface LayoutAttributes
  extends LayoutProperties,
    ScreenLayoutProperties,
    LayoutSpecificAttributes {}

export interface LayoutSpecificAttributes {
  orientation?: CompositionLayoutOrientation;
}

export interface LayoutProperties extends LayoutProperty {
  /**
   * Layout type that is used all screen sizes.
   *
   * The layout type is used by the component logic to load the relevant styles and write
   * in the `<style></style>` property dynamically.
   *
   * Whenever a layout for a specific screen size should be used, other layout properties
   * should be used (eg `xs: {layout: "grid"}`).
   */
  layout?: CompositionLayout | LayoutTypes;
}

type ScreenLayoutProperties = {
  /**
   * Indicates layout\bleed\sticky properties per breakpoint size
   */
  [breakpoint in Breakpoint]?: LayoutProperties;
};
