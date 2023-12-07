import { Size } from '@spryker-oryx/utilities';

/**
 * Interface for pagination information.
 */
export interface Pagination {
  /**
   * The number of items per page.
   */
  itemsPerPage: number;

  /**
   * The current page number.
   */
  currentPage: number;

  /**
   * The maximum page number.
   */
  maxPage: number;

  /**
   * The total number of items found.
   */
  numFound: number;
}

export interface Product {
  sku?: string;
  /**
   * Ids of the category to which the product belongs.
   */
  categoryIds?: string[];
  attributeNames?: Record<string, string>;
  attributes?: Record<string, string>;
  averageRating?: number;
  reviewCount?: number;
  name?: string;
  description?: string;
  price?: ProductPrices;
  mediaSet?: ProductMediaSet[];
  labels?: ProductLabel[];
  availability?: ProductAvailability;
  offers: ProductOffer[];
  // TODO: Fix by augmentation
  merchantId?: string;
}

export interface ProductOffer {
  id: string;
  isDefault?: boolean;
  price: ProductPrices;
  // TODO: Fix by augmentation
  merchant: any;
  availability?: ProductAvailability;
}

export interface ProductLabel {
  name: string;
  appearance?: ProductLabelAppearance;
}

export const enum ProductLabelAppearance {
  Highlight = 'error',
  Info = 'info',
}
export interface ProductList {
  products: Product[];
  facets?: Facet[];
  pagination?: Pagination;
  sort?: ProductListSort;
}

export interface ProductListSort {
  sortParam: string;
  sortOrder: string;
  sortValues: Array<SortValues>;
}

export interface SortValues {
  sortKey: string;
  sortName: string;
}

export interface RangeFacet {
  type: FacetType.Range;
  name: string;
  parameter: string;
  values: RangeFacetValue;
}

export interface ValueFacet {
  type: FacetType.Single | FacetType.Multi;
  name: string;
  parameter: string;
  values: FacetValue[];
  valuesTreeLength?: number;
  selectedValues?: (string | number)[];
  /** @deprecated since 1.2 use facet.type === FacetType.Multi check instead*/
  multiValued?: boolean;
}

export type Facet = ValueFacet | RangeFacet;

export interface RangeFacetValue {
  min: number;
  max: number;
  selected?: RangeFacetValue;
}

export interface FacetValue {
  /**
   * The facet value that is used to filter the list
   */
  value: string | number;

  /**
   * The number of documents that will be returned when this list is filtered
   * with this facet.
   */
  count: number;

  /**
   * The localised name that is rendered in the UI.
   */
  name?: string;

  /**
   * Indicates whether this value is selected.
   */
  selected?: boolean;

  children?: FacetValue[];
}

export type ProductMediaSet = {
  name?: string;
  media: ProductMedia[];
};

/**
 *
 * Product media are typically provided in different sizes, so that an
 * optimized experience can be created for each product image usage and
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
 * The media context can be used to further optimize the experience and provide
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
  /**
   * This property is a boolean value that indicates whether the product is considered
   * to be never out of stock. If the value is true, it means that the product is always
   * available and will never go out of stock. If the value is false, it means that the
   * product can go out of stock.
   */
  isNeverOutOfStock: boolean;

  /**
   * This property represents the availability status of the product. It is a boolean value,
   * where true indicates that the product is currently available for purchase, and false
   * indicates that it is not available.
   */
  availability: boolean;

  /**
   * The quantity property provides a more granular understanding of the quantity of the
   * product that can be fulfilled.
   */
  quantity: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  order: number;
  parent?: string;
  description?: string;
}

export const enum FacetType {
  Single = 'single',
  Multi = 'multi',
  Range = 'range',
}
