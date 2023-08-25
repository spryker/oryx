import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';

export class MockBreadcrumbService implements BreadcrumbService {
  get(): Observable<BreadcrumbItem[]> {
    return of([
      { text: 'Home', url: '/' },
      { text: 'Cameras & Camcorders', url: '/1' },
      { text: 'Digital Cameras', url: '/2' },
    ]);
  }
}
