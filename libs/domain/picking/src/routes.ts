import { resolve } from '@spryker-oryx/di';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { map, Observable, take } from 'rxjs';
import { PickingListService } from './services';

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
      return resolve(PickingListService)
        .allowDiscardPicking()
        .pipe(
          take(1),
          map((allowDiscardPicking) => !!allowDiscardPicking)
        );
    },
  },
  {
    path: '/customer-note-info/:id',
    render: ({ id }) => html`
      <oryx-customer-note .pickingListId=${id} mode-light></oryx-customer-note>
    `,
  },
];
