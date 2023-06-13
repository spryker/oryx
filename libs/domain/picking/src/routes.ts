import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { Observable } from 'rxjs';

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () => html`<oryx-picking-lists mode-light></oryx-picking-lists>`,
  },
  {
    path: '/picking-list/picking/:id',
    render: ({ id }) =>
      html`<oryx-picking .pickingListId="${id}" mode-light></oryx-picking>`,
    leave: (): Observable<boolean> => {
      return resolve(RouterService).shouldGuardRoute();
    },
  },
  {
    path: '/customer-note-info/:id',
    render: ({ id }) => html`
      <oryx-customer-note .pickingListId=${id} mode-light></oryx-customer-note>
    `,
  },
];
