import { QueryEvent } from '@spryker-oryx/core';
import { ProductCategory } from '../../../models';

export const CategoriesLoaded = 'CategoriesLoaded';

export type CategoriesLoaded = QueryEvent<ProductCategory[]>;
