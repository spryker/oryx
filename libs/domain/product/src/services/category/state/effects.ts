import { provideEffect } from '@spryker-oryx/core';
import { ProductCategory } from '../../../models';
import { CategoriesLoaded } from './events';
import { CategoryQuery } from './queries';

export const categoryEffects = [
  provideEffect<ProductCategory[]>([
    CategoriesLoaded,
    ({ event, query }) => {
      if (event.data?.length) {
        const q = query.getQuery(CategoryQuery);
        event.data.forEach((data) => {
          q?.set({ data, qualifier: { id: data.id } });
        });
      }
    },
  ]),
];
