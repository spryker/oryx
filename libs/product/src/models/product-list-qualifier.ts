export interface ProductListQualifier {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  storageCapacity?: string;
  brand?: string;
  label?: string;
  weight?: string;
  color?: string;
  category?: string;
  currency?: string;
  sort?: SortParamNames;
  page?: number;
  ipp?: number;
}

export enum SortParamNames {
  None = '',
  Rating = 'rating',
  NameAsc = 'name_asc',
  NameDesc = 'name_desc',
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  Popularity = 'popularity',
}
