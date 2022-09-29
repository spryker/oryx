import { ThemeData } from '@spryker-oryx/core';
import { css } from 'lit';

export const iconButtonStorefrontUI: ThemeData = {
  styles: [
    css`
      ::slotted(*) {
        background-color: var(--oryx-color-canvas);
      }
    `,
  ],
};
