import { ProductListSort } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { SortingService } from '../../../services/sorting.service';

const mock: ProductListSort = {
  sortOrder: '',
  sortParam: '',
  sortValues: [
    {
      sortKey: 'rating',
      sortName: 'Sort by product ratings',
    },
    {
      sortKey: 'nameAsc',
      sortName: 'Sort by name ascending',
    },
    {
      sortKey: 'nameDesc',
      sortName: 'Sort by name descending',
    },
    {
      sortKey: 'priceAsc',
      sortName: 'Sort by price ascending',
    },
    {
      sortKey: 'priceDesc',
      sortName: 'Sort by price descending',
    },
    {
      sortKey: 'popularity',
      sortName: 'Sort by popularity',
    },
  ],
};

export class MockSortingService implements SortingService {
  get(): Observable<ProductListSort | null> {
    return of(mock);
  }
}
