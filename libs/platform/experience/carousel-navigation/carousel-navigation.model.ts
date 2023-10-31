import {
  CarouselArrowPosition,
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
} from '../src/services';

export interface CarouselNavigationComponentAttributes {
  /**
   * Indicates whether the previous and next arrows should be show or not.
   */
  arrowsPosition?: CarouselArrowPosition;

  /**
   * Indicates whether the indicators should be positioned at the bottom of the slide,
   * or below the carousel. If `none` is provided, it indicates that the indicators
   * should not be shown.
   */
  indicatorsPosition?: CarouselIndicatorPosition;

  /**
   * Indicates whether the indicators should be aligned to the start, center or end.
   */
  indicatorsAlignment?: CarouselIndicatorAlignment;

  /**
   * Indicates whether the navigation should snap to a single carousel item or per screen.
   */
  // snap?: 'item' | 'screen';
}
