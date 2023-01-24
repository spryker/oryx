import { Pagination, ProductListPageService } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';

export class MockProductListPageService
  implements Partial<ProductListPageService>
{
  getPagination(): Observable<Pagination | undefined> {
    return of({
      itemsPerPage: 10,
      currentPage: 1,
      maxPage: 10,
      numFound: 100,
    });
  }
}
