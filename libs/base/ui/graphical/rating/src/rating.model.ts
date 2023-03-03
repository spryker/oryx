import { Size } from '../../../src/utilities';

export interface RatingProperties {
  /**
   * The value can be used to set the (average) scale in readonly mode but
   * is also updated when the rating is set by the user in non-readonly mode.
   */
  value?: number;

  /**
   * When the rating component is readonly, the UI won't provide interactive
   * elements. The given value is used to display the (average) rating value.
   */
  readonly?: boolean;

  /**
   * Represents the number of reviews that have been given. The count
   * is important for the end-user, as the average star rating combined with a
   * high number of reviews is more trustworthy than just a small number of reviews.
   *
   * When the reviewCount is `undefined`, it will not be rendered.
   */
  reviewCount?: number | string;

  /**
   * A 5-star rating scale is most common on, but some business might require
   * an alternative scale, such as 7 or 10.
   *
   * Defaults to 5.
   */
  scale?: number;

  /**
   * Allows to set the characters for each rate. When characters are _not_ provided,
   * an svg-based star rating icon is used.
   *
   * An example of characters for emoji based rating system:
   *
   * ```html
   * <oryx-rating characters="😡😔😐😀🤩"></oryx-rating>
   * ```
   *
   * While characters can be attractive to submit a rating, they do not work well
   * when the average rating is displayed. Average rating requires a visual effect
   * on the exact rating (i.e. 4.3), which cannot be done easily with emojis.
   * SVGs are much better to render the average rating, since the average rate
   * number can be filled in the background color of the star shape.
   */
  characters?: string;

  /**
   * Controls the size of the visual rating symbols.
   *
   * Large results in a 18x18px square where rating symbols are rendered.
   * Small results in a 12x12px square where rating symbols are rendered.
   *
   * No default value, but the styles default to large size.
   */
  size?: Size.Sm | Size.Lg;
}
