import { resolve } from '@spryker-oryx/di';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { html } from 'lit';
import { Observable, map, tap } from 'rxjs';
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
    // afterEnter: (): Observable<void> => 
    //   resolve(PickingGuardService).guard(),
    leave: (): Observable<boolean> =>
      resolve(PickingGuardService).isProtected().pipe(map(isProtected => !isProtected)),
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
