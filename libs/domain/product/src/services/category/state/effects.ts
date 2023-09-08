import { provideFactoryEffect } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ProductCategory } from '../../../models';
import { ProductCategoryService } from '../category.service';
import { CategoriesLoaded } from './events';

export const categoryEffects = [
  provideFactoryEffect<ProductCategory[]>(
    (service = inject(ProductCategoryService)) => [
      CategoriesLoaded,
      ({ event }) => service.add(event.data ?? []),
    ]
  ),
];
