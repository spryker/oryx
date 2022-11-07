import { ThemeData } from '@spryker-oryx/core';
import { css, unsafeCSS } from 'lit';
import { ChipAppearance } from '../../chip.model';

export const chipStorefrontUI: ThemeData = {
  styles: [
    css`
      :host {
        border-radius: 38px;
        color: var(--oryx-color-canvas);
        background-color: var(--oryx-chip-background-color, #71747c);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Info)}']) {
        background-color: var(--oryx-chip-info-background-color, #1ebea0);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Highlight)}']) {
        background-color: var(
          --oryx-chip-highlight-background-color,
          var(--oryx-color-highlight)
        );
      }
    `,
  ],
};
