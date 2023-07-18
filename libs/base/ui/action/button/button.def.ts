import { componentDef } from '@spryker-oryx/core';

export const actionComponent = componentDef({
  name: 'oryx-button',
  impl: () => import('./button.component').then((m) => m.ButtonComponent),
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
