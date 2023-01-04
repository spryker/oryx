import { Type } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { Product } from '../models';
import { ProductComponentProperties } from '../models';

export const ProductComponentMixin = <T>(): Type<
  LitElement & ContentComponentProperties<T> & ProductComponentProperties
> => {
  class ProductComponent
    extends ComponentMixin<T>()
    implements ProductComponentProperties
  {
    @property({ type: String }) sku?: string;
    @property({ type: Object }) product?: Product;
  }
  return ProductComponent as Type<
    LitElement & ContentComponentProperties<T> & ProductComponentProperties
  >;
};
