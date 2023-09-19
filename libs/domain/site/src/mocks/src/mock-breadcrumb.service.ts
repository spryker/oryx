import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockBreadcrumbService implements BreadcrumbService {
  protected breadcrumbs$ = new BehaviorSubject<BreadcrumbItem[]>([
    { text: { raw: 'Home' }, url: '/' },
    { text: { raw: 'Cameras & Camcorders' }, url: '/1' },
    { text: { raw: 'Digital Cameras' }, url: '/2' },
  ]);

  get(): Observable<BreadcrumbItem[]> {
    return this.breadcrumbs$;
  }

  set(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbs$.next(breadcrumbs);
  }
}
