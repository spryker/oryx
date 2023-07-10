import { componentDef } from '@spryker-oryx/core';

export const actionComponent = componentDef({
  name: 'oryx-action',
  impl: () => import('./action.component').then((m) => m.ActionComponent),
  //   stylesheets: [
  //     {
  //       theme: 'backoffice',
  //       rules: () =>
  //         import('./styles/backoffice.styles').then(
  //           (m) => m.backOfficeLinkStyles
  //         ),
  //     },
  //   ],
});
