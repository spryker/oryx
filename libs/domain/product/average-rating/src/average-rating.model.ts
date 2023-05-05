import { Size } from '@spryker-oryx/utilities';

export interface ProductAverageRatingOptions {
  /** Indicates whether the reviewCount should be rendered  */
  enableCount?: boolean;

  /** Size of the rating icons */
  size?: Size.Sm | Size.Lg;
}
