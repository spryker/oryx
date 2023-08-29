import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockBreadcrumbService implements BreadcrumbService {
  protected breadcrumbs$ = new BehaviorSubject<BreadcrumbItem[]>([
    { text: 'Home', url: '/' },
    { text: 'Cameras & Camcorders', url: '/1' },
    { text: 'Digital Cameras', url: '/2' },
  ]);

  get(): Observable<BreadcrumbItem[]> {
    return this.breadcrumbs$;
  }

  set(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbs$.next(breadcrumbs);
  }
}
