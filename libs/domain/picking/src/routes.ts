import { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () => html`<oryx-picking-lists mode-light></oryx-picking-lists>`,
  },
  {
    path: '/picking-list/picking/:id',
    render: ({ id }) =>
      html`<oryx-picking
        picking-id="${ifDefined(id)}"
        mode-light
      ></oryx-picking>`,
  },
];
