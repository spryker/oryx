import { ProductCategory, ProductCategoryService } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';

export class MockProductCategoryService
  implements Partial<ProductCategoryService>
{
  static mockCategories: ProductCategory[] = [
    { description: 'Computer', id: '5', name: 'Computer', order: 100 },
    {
      description: 'Notebooks',
      id: '6',
      name: 'Notebooks',
      order: 100,
      parent: '5',
    },
    {
      description: 'Cameras & Camcorders',
      id: '2',
      name: 'Cameras & Camcorders',
      order: 90,
    },
    {
      description: 'Digital Cameras',
      id: '4',
      name: 'Digital Cameras',
      order: 100,
      parent: '2',
    },
    {
      description: 'Smart Wearables',
      id: '9',
      name: 'Smart Wearables',
      order: 70,
    },
  ];

  get(categoryId?: string): Observable<ProductCategory> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return of(
      MockProductCategoryService.mockCategories.find(
        (c) => c.id === categoryId
      )!
    );
  }

  getTree(): Observable<ProductCategory[]> {
    return of(MockProductCategoryService.mockCategories);
  }
}
