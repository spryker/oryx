import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { ProductCategory, ProductCategoryNode } from '../../models';
import { ProductCategoryAdapter } from './adapter/product-category.adapter';
import { CategoryData, ProductCategoryService } from './category.service';

export class DefaultProductCategoryService implements ProductCategoryService {
  constructor(protected adapter = inject(ProductCategoryAdapter)) {}

  protected data$ = new BehaviorSubject<CategoryData | null>(null);

  get(): Observable<CategoryData> {
    return this.getData();
  }

  getTrail(categoryId: string): Observable<ProductCategory[]> {
    return this.getData().pipe(
      map(({ tree, trails }) => {
        //find and cut the trail with given category id
        const trail = trails
          .find((t) => t.includes(categoryId))
          ?.filter((id, i, arr) => i <= arr.indexOf(categoryId));

        if (!trail) return [];

        const result: ProductCategory[] = [];
        let target = tree;

        //flatten trail
        trail?.forEach((_id) => {
          const { id, name, order, children } = target.find(
            (cat) => cat.id === _id
          ) as ProductCategoryNode;
          result.push({ id, name, order });
          target = children;
        });

        return result;
      })
    );
  }

  protected getData(): Observable<CategoryData> {
    return this.data$.pipe(
      switchMap((data) =>
        data
          ? of(data)
          : this.adapter.getTree().pipe(
              switchMap((tree) => {
                const trails = this.collectTrails(tree);
                this.data$.next({ tree, trails });
                return this.data$ as Observable<CategoryData>;
              })
            )
      )
    );
  }

  protected collectTrails(categories: ProductCategoryNode[]): string[][] {
    const trails: string[][] = [];

    const collectTrails = (
      cats: ProductCategoryNode[],
      collected: string[]
    ): string[][] | void => {
      if (cats.length) {
        cats.forEach((child_cat) => {
          collectTrails(child_cat.children, [...collected, child_cat.id]);
        });
        return;
      }

      trails.push(collected);
    };

    collectTrails(categories, []);

    return trails;
  }
}
