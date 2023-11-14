import { resolve } from '@spryker-oryx/di';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { Observable } from 'rxjs';
import { PickingHeaderService } from './services';

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () =>
      html`<oryx-composition uid="picking-lists"></oryx-composition>`,
  },
  {
    path: '/warehouse-selection',
    render: () =>
      html`<oryx-composition uid="warehouse-selection"></oryx-composition>`,
  },
  {
    path: '/picking-list/picking/:id',
    render: ({ id }) =>
      html`<oryx-picking-picker
        .pickingListId="${id}"
        mode-light
      ></oryx-picking-picker>
      <!-- TODO: drop after complete migration to the experience data -->
      <oryx-site-notification-center></oryx-site-notification-center>
      `,
    leave: (): Observable<boolean> =>
      resolve(PickingHeaderService).guardWithDialog(),
  },
  {
    path: '/customer-note-info/:id',
    render: ({ id }) => html`
      <oryx-picking-customer-note
        .pickingListId=${id}
        mode-light
      ></oryx-picking-customer-note>
      <!-- TODO: drop after complete migration to the experience data -->
      <oryx-site-notification-center></oryx-site-notification-center>
    `,
  },
];
