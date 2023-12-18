import { inject } from '@spryker-oryx/di';
import { map, Observable } from 'rxjs';
import { RouterService } from './router.service';

export function routeEntityContextFallbackFactory(
  router = inject(RouterService)
): Observable<string | undefined> {
  return router.current().pipe(map((route) => route.type ?? undefined));
}
