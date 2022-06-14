export type Resource = {
  name: string;
  url: string;
};

export type AbstractProduct = {
  price: number;
  abstractName: string;
  abstractSku: string;
  url: string;
  images?: { externalUrlSmall?: string; externalUrlLarge?: string }[];
};

export interface Suggestion {
  completion?: string[];
  categories?: Resource[];
  cmsPages?: Resource[];
  abstractProducts?: AbstractProduct[];
}
