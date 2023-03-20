import { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';

export const defaultPickingRoutes: RouteConfig[] = [
  { path: '/', render: () => html`<oryx-picking-lists></oryx-picking-lists>` },
  { 
    name: 'customer-note',
    path: '/customer-note-info/:id', render: ({id}) => html`
    <oryx-customer-note .pickingId=${id}></oryx-customer-note>
  `},
  { 
    name: 'picking-items',
    path: '/picking-list/picking/:id', 
    render: ({id}) => html`${id}`
  },
];
