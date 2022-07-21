import { ProductComponentProperties } from '@spryker-oryx/product';

export interface ProductIdOptions {
  prefix?: string;
}

export type Props = ProductIdOptions & ProductComponentProperties;
