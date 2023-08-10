import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { combineLatest, map, take } from 'rxjs';
import { OrderService } from './order.service';

export const orderRoutes: RouteConfig[] = [
  {
    path: '/order/:id',
    type: RouteType.Order,
    enter: ({ id }) =>
      combineLatest([
        resolve(OrderService)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .get({ id: id! }),
        resolve(OrderService).getLastOrder(),
      ]).pipe(
        take(1),
        map(([order, last]) =>
          order || last?.id === id ? true : RouteType.NotFound
        )
      ),
  },
];
