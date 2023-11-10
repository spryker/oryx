import { Observable, of } from 'rxjs';
import { ProductCategory } from '../../models';
import { ProductCategoryService } from '../../services';

export class MockProductCategoryService
  implements Partial<ProductCategoryService>
{
  static mockProductsCategories: ProductCategory[] = [
    { id: '2', name: 'Cameras & Camcorders', order: 0 },
    { id: '5', name: 'Computer', order: 0 },
    { id: '9', name: 'Smart Wearables', order: 0 },
    { id: '11', name: 'Telecom & Navigation', order: 0 },
  ];

  get(id: string): Observable<ProductCategory> {
    const productCategory =
      MockProductCategoryService.mockProductsCategories.find(
        (p) => p.id === id
      ) as ProductCategory;

    return of(productCategory);
  }
}
