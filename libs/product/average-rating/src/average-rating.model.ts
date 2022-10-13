import { Size } from '@spryker-oryx/ui/utilities';

export interface ProductAverageRatingModel {
  /** Indicates whether the reviewCount should be rendered  */
  hideReviewCount?: boolean;

  /** Size of the rating icons */
  size?: Size.small | Size.large;
}
