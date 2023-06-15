import { resolve } from '@spryker-oryx/di';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { Observable } from 'rxjs';
import { PickingHeaderService } from './services';

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () => html`<oryx-picking-lists mode-light></oryx-picking-lists>`,
  },
  {
    path: '/picking-list/picking/:id',
    render: ({ id }) =>
      html`<oryx-picking .pickingListId="${id}" mode-light></oryx-picking>`,
    enter: (): boolean => {
      resolve(PickingHeaderService).setRouteGuard(true);
      return true;
    },
    leave: (): Observable<boolean> => {
      return resolve(PickingHeaderService).shouldGuardRoute();
    },
  },
  {
    path: '/customer-note-info/:id',
    render: ({ id }) => html`
      <oryx-customer-note .pickingListId=${id} mode-light></oryx-customer-note>
    `,
  },
];
