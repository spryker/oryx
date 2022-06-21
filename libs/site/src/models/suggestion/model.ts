import { Product } from '@spryker-oryx/product';

export type Resource = {
  name: string;
  url: string;
};

export interface Suggestion {
  completion: string[];
  categories: Resource[];
  cmsPages: Resource[];
  products: Product[];
}
