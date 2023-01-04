import { ThemeData } from '@spryker-oryx/core';
import { css, unsafeCSS } from 'lit';
import { ChipAppearance } from '../../chip.model';

export const chipStorefrontUI: ThemeData = {
  styles: [
    css`
      :host {
        --bg: var(--oryx-color-neutral-300);

        border-radius: 38px;
        color: var(--oryx-color-canvas-100);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Offline)}']),
      :host([appearance='${unsafeCSS(ChipAppearance.Inactive)}']) {
        --bg: var(--oryx-color-neutral-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Success)}']),
      :host([appearance='${unsafeCSS(ChipAppearance.Online)}']),
      :host([appearance='${unsafeCSS(ChipAppearance.Active)}']) {
        --bg: var(--oryx-color-success-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Low)}']) {
        --bg: var(--oryx-chip-low-color, #cd8814);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Warning)}']) {
        --bg: var(--oryx-color-warning-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Highlight)}']) {
        --bg: var(--oryx-color-highlight-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Info)}']) {
        --bg: var(--oryx-color-info-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Error)}']) {
        --bg: var(--oryx-color-error-300);
      }
    `,
  ],
};
