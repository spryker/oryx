import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { ProductCategory } from '../../models';
import { ProductCategoryAdapter } from './adapter/product-category.adapter';
import { ProductCategoryService } from './category.service';

export class DefaultProductCategoryService implements ProductCategoryService {
  constructor(protected adapter = inject(ProductCategoryAdapter)) {}

  protected categories = new Map<string, BehaviorSubject<ProductCategory>>();

  add(categories: ProductCategory[]): void {
    categories.forEach((cat) => {
      if (this.categories.has(cat.id)) {
        this.categories.get(cat.id)!.next(cat);
      }
      this.categories.set(cat.id, new BehaviorSubject(cat));
    });
  }

  get(categoryId: string): Observable<ProductCategory> {
    if (!this.categories.has(categoryId)) {
      this.fetchCategory(categoryId);
    }
    return this.categories.get(categoryId)!;
  }

  getTrail(categoryId: string): Observable<ProductCategory[]> {
    return this.get(categoryId).pipe(
      switchMap((category) =>
        category.parent
          ? this.getTrail(category.parent).pipe(
              map((trail) => [...trail, category])
            )
          : of([category])
      ),
      map((trail) => trail.sort((a, b) => (a.id === b.parent ? -1 : 1)))
    );
  }

  protected fetchCategory(categoryId: string): void {
    this.categories.set(categoryId, new BehaviorSubject({} as ProductCategory));
    this.adapter
      .get(categoryId)
      .subscribe((category) => this.categories.get(categoryId)!.next(category));
  }
}
