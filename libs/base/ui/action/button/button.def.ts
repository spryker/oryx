import { Size, componentDef } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const buttonComponent = componentDef({
  name: 'oryx-button',
  impl: () => import('./button.component').then((m) => m.ButtonComponent),
  stylesheets: [
    {
      rules: [
        {
          media: { screen: Size.Sm },
          css: css`
            :host(:not([type='icon'])) {
              width: 100%;
            }
          `,
        },
      ],
    },
  ],
});
