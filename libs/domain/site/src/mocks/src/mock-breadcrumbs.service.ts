import { Breadcrumb, BreadcrumbsService } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';

export class MockBreadcrumbsService implements BreadcrumbsService {
  get(): Observable<Breadcrumb[]> {
    return of([
      { text: 'Home', url: '/' },
      { text: 'Cameras & Camcorders', url: '/1' },
      { text: 'Digital Cameras', url: '/2' },
    ]);
  }
}
