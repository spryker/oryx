import { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () => html`<oryx-picking-lists mode-light></oryx-picking-lists>`,
  },
  {
    path: '/picking-list/picking/:id',
    render: ({ id }) =>
      html`<oryx-picking .pickingListId="${id}" mode-light></oryx-picking>`,
  },
  {
    path: '/customer-note-info/:id',
    render: ({ id }) => html`
      <oryx-customer-note .pickingListId=${id} mode-light></oryx-customer-note>
    `,
  },
];
