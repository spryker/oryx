import { resolve } from '@spryker-oryx/di';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { Observable, map, of, take, tap } from 'rxjs';
import { PickingGuardService } from './services';

export const defaultPickingRoutes: RouteConfig[] = [
  {
    path: '/',
    render: () =>
      html`<oryx-composition
        uid="picking-lists"
        mode-light
      ></oryx-composition>`,
  },
  {
    path: '/warehouse-selection',
    render: () =>
      html`<oryx-composition
        uid="warehouse-selection"
        mode-light
      ></oryx-composition>`,
  },
  {
    path: '/picking-list/picking/:pickingListId',
    render: () =>
      html`<oryx-composition
        uid="picking-picker"
        mode-light
      ></oryx-composition>`,
    enter: (): Observable<boolean> => {
      resolve(PickingGuardService).guard();
      return of(true);
    },
    leave: (): Observable<boolean> =>{
      return resolve(PickingGuardService).isProtected().pipe(
        take(1),
        map(isProtected => !isProtected),
      )},
  },
  {
    path: '/customer-note-info/:pickingListId',
    render: () =>
      html`<oryx-composition
        uid="customer-note"
        mode-light
      ></oryx-composition>`,
  },
];
