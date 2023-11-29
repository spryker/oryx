import { Observable, of } from 'rxjs';
import { ProductCategory, ProductCategoryQualifier } from '../../models';
import { ProductCategoryService } from '../../services';

export class MockProductCategoryService
  implements Partial<ProductCategoryService>
{
  static mockProductsCategories: ProductCategory[] = [
    { id: '2', name: 'Cameras & Camcorders', order: 0 },
    { id: '5', name: 'Computer', order: 0 },
    { id: '6', name: 'Notebooks', parent: '5', order: 0 },
    { id: '7', name: "Pc's/workstations", parent: '5', order: 0 },
    { id: '8', name: 'Tablets', parent: '5', order: 0 },
    { id: '9', name: 'Smart Wearables', order: 0 },
    { id: '11', name: 'Telecom & Navigation', order: 0 },
  ];

  get(
    qualifier: string | ProductCategoryQualifier
  ): Observable<ProductCategory> {
    if (typeof qualifier === 'string') return this.get({ id: qualifier });
    const category = MockProductCategoryService.mockProductsCategories.find(
      (p) => p.id === qualifier.id
    ) as ProductCategory;
    return of(category);
  }

  getList(qualifier: ProductCategoryQualifier): Observable<ProductCategory[]> {
    return of(
      MockProductCategoryService.mockProductsCategories.filter((category) => {
        return !qualifier?.parent
          ? !category.parent
          : category.parent === qualifier?.parent;
      })
    );
  }
}
