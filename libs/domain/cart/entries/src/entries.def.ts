import { Size, componentDef } from '@spryker-oryx/utilities';
import { css } from 'lit';
import { CartEntriesOptions } from './entries.model';

declare global {
  interface FeatureOptions {
    'oryx-cart-entries'?: CartEntriesOptions;
  }
}

export const cartEntriesComponent = componentDef({
  name: 'oryx-cart-entries',
  impl: () => import('./entries.component').then((m) => m.CartEntriesComponent),
  schema: () =>
    import('./entries.schema').then((m) => m.cartEntriesComponentSchema),
  stylesheets: [
    {
      rules: [
        {
          media: { screen: Size.Sm },
          css: css`
            oryx-cart-entry:first-child {
              border-top: 1px solid var(--oryx-color-neutral-6);
            }
            oryx-cart-entry:last-child {
              border-bottom: 1px solid var(--oryx-color-neutral-6);
            }
          `,
        },
      ],
    },
  ],
});
