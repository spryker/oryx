import { LayoutPlugin } from '../../layout.plugin';

export const CarouselLayoutPluginToken = `${LayoutPlugin}carousel`;

export interface CarouselLayoutProperties {
  /**
   * If true, display arrow buttons for navigation.
   *
   * The arrow buttons are only visible when they can be used
   * (e.g., the previous button is not visible on the first slide).
   */
  showArrows?: boolean;

  /**
   * If true, display indicators for slide navigation.
   */
  showIndicators?: boolean;

  /**
   * Determines the arrow button navigation behavior.
   *
   * - `'slide'`: Arrow buttons navigate to the next slide.
   * - `'item'`: Arrow buttons navigate to the next item.
   */
  arrowNavigationBehavior?: ArrowNavigationBehavior;

  /**
   * The position of indicators representing carousel slides.
   */
  indicatorsPosition?: CarouselIndicatorPosition;

  /**
   * The alignment of carousel indicators.
   */
  indicatorsAlignment?: CarouselIndicatorAlignment;

  /**
   * Enables or disables scrolling with a mouse.
   */
  scrollWithMouse?: boolean;

  /**
   * Enables or disables scrolling with touch input (e.g., touchscreen).
   */
  scrollWithTouch?: boolean;

  /**
   * The scroll behavior of the carousel.
   */
  scrollBehavior?: CarouselScrollBehavior;
}

export const enum ArrowNavigationBehavior {
  Slide = 'slide',
  Item = 'item',
}

export const enum CarouselScrollBehavior {
  Smooth = 'smooth',
  Instant = 'instant',
}

declare global {
  export interface Layouts {
    carousel: undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends CarouselLayoutProperties {}
}

export enum CarouselIndicatorPosition {
  Bottom = 'bottom',
  Below = 'below',
}

export enum CarouselIndicatorAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
}
