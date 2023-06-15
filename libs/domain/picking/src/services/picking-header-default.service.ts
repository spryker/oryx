import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PickingHeaderService } from './picking-header.service';

export class PickingHeaderDefaultService implements PickingHeaderService {
  protected shouldGuardRoute$ = new BehaviorSubject(true);

  constructor(protected routerService = inject(RouterService)) {}

  shouldGuardRoute(): Observable<boolean> {
    return this.shouldGuardRoute$;
  }

  setRouteGuard(value: boolean): void {
    this.shouldGuardRoute$.next(value);
  }
}
