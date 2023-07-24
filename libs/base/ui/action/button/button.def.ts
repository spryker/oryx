import { componentDef } from '@spryker-oryx/utilities';

export const buttonComponent = componentDef({
  name: 'oryx-button',
  impl: () => import('./button.component').then((m) => m.ButtonComponent),
  // stylesheets: [
  //   {
  //     rules: [
  //       {
  //         media: { screen: Size.Sm },
  //         css: css`
  //           :is(a, button),
  //           ::slotted(:is(a, button)) {
  //             width: 100%;
  //           }
  //         `,
  //       },
  //     ],
  //   },
  // ],
});
