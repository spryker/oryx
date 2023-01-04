/**
 * The screen size definition is used to build a (CSS) media query.
 * The min and max values are optional, and define the so-called
 * _breakpoint_ of the layout.
 */
export interface ScreenSize {
  /**
   * The minimum screen size in pixels. If not provided, the layout rules
   * for this screen will start from `0`.
   */
  min?: number;
  /**
   * The maximum screen size in pixels. If not provided, the layout rules
   * for this screen will not be limited to a max size.
   */
  max?: number;
}
