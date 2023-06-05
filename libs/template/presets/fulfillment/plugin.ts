import {
  App,
  AppPlugin,
  StorageService,
  StorageType,
} from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { BehaviorSubject, combineLatest, take, tap } from 'rxjs';

const CAN_LEAVE_ROUTE = 'canLeaveRoute';

export class RouteGuardPlugin implements AppPlugin {
  getName(): string {
    return 'oryx$routeguard';
  }

  apply(app: App): void | Promise<void> {
    window.addEventListener('popstate', () => {
      combineLatest([
        resolve(RouterService).previousRoute(),
        resolve(RouterService).currentRoute(),
        resolve(StorageService).get<string>(
          CAN_LEAVE_ROUTE,
          StorageType.SESSION
        ),
      ])
        .pipe(
          tap(([previous, current, canLeaveRoute]) => {
            if (canLeaveRoute) {
              (
                resolve(RouterService).routeGuard() as BehaviorSubject<string>
              ).next('');
              resolve(StorageService).remove(
                CAN_LEAVE_ROUTE,
                StorageType.SESSION
              );
              return;
            }
            if (current.startsWith('/picking-list')) {
              (
                resolve(RouterService).routeGuard() as BehaviorSubject<string>
              ).next('');
              history.go(1);
              return;
            }

            if (previous?.startsWith('/picking-list')) {
              (
                resolve(RouterService).routeGuard() as BehaviorSubject<string>
              ).next(previous);
            }
          }),
          take(1)
        )
        .subscribe();
    });
  }
}
