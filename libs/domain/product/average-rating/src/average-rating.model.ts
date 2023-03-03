import { Size } from '@spryker-oryx/ui';

export interface ProductAverageRatingOptions {
  /** Indicates whether the reviewCount should be rendered  */
  enableCount?: boolean;

  /** Size of the rating icons */
  size?: Size.Small | Size.Large;
}
