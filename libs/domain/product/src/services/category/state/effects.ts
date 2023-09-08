import { provideEffect } from '@spryker-oryx/core';
import { CategoriesLoaded } from './events';
import { resolve } from '@spryker-oryx/di';
import { ProductCategoryService } from '../category.service';

export const categoryEffects = [
  provideEffect<CategoriesLoaded>([
    CategoriesLoaded,
    ({ event }) => {
      resolve(ProductCategoryService).add(event.data ?? []);
    },
  ]),
];
