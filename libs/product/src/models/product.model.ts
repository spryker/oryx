export interface Product {
  sku?: string;
  attributeNames?: Record<string, string>;
  attributes?: Record<string, string>;
  averageRating?: number;
  reviewCount?: number;
  name?: string;
  description?: string;
  price?: ProductPrices;
  images?: ProductMedia[];
  labels?: ProductLabel[];
  availability?: ProductAvailability;
}

export interface ProductLabel {
  name: string;
  appearance?: ProductLabelAppearance;
}

export const enum ProductLabelAppearance {
  Highlight = 'highlight',
  Info = 'info',
}
export interface ProductList {
  products: Product[];
}

/**
 * TODO: drop `externalUrlSmall` and `externalUrlLarge` and move to
 * utility package as it's a generic reusable Size.
 *
 * Product media are typically provided in different sizes, so that an
 * optimised experience can be created for each product image usage and
 * user device/screen size.
 *
 * The `ProductMediaSize` provides all sizes potentially available. While
 * Spryker only provides `small` and `large`, project implementation can
 * extend the product data model or integrate with 3rd party services to
 * generate more image sizes.
 *
 * The media size is not directly related to a device, as different sizes
 * can be used in different context. For example, a small image might be used for
 * an icon-sized media on a double-density device on a high-speed connection.
 *
 * The actual size (width/height) of each media is provided additionally.
 */

export const enum Size {
  Xs = 'xs',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',

  /**
   * @deprecated we use Sm going forward
   */
  externalUrlSmall = 'externalUrlSmall',
  /**
   * @deprecated we use Lg going forward
   */
  externalUrlLarge = 'externalUrlLarge',
}

export type ProductMedia = {
  [key in Size]?: string;
};

/**
 * The media format represents the semantic usage of the media.
 */
export const enum ProductMediaContainerSize {
  Icon = 'icon',
  Thumbnail = 'thumbnail',
  Detail = 'detail',
  Full = 'full',
}

/**
 * The media context can be used to further optimise the experience and provide
 * specific media for a specific device or network speed.
 */
export interface MediaContext {
  density?: number;
  connection?: 'slow' | 'fast';
}

export interface ImageSource {
  url: string;
  size?: Size;
  context?: MediaContext;
}

export interface ProductPrices {
  defaultPrice?: ProductPrice;

  /**
   * Often referred to as the _strikethrough_ or _purchase_ price.
   */
  originalPrice?: ProductPrice;
}

export interface ProductPrice {
  /**
   * The price value either is the gross or net value, depending on
   * the isNet flag.
   */
  value: number;

  /** The currency code  */
  currency: string;

  /** Indicates whether the price is net or gross */
  isNet: boolean;
}

export interface ProductOption {
  optionGroupName?: string;
  sku?: string;
  optionName?: string;
  price?: number;
}

export interface ProductAvailability {
  isNeverOutOfStock: boolean;
  availability: boolean;
  quantity: number;
}
