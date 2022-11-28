import { ThemeData } from '@spryker-oryx/core';
import { css, unsafeCSS } from 'lit';
import { ChipAppearance } from '../../chip.model';

export const chipBackofficeUI: ThemeData = {
  styles: [
    css`
      :host {
        border-radius: var(--oryx-border-radius);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Inactive)}']) {
        --bg: var(--oryx-color-canvas-200);
        --c: var(--oryx-color-neutral-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Success)}']),
      :host([appearance='${unsafeCSS(ChipAppearance.Online)}']),
      :host([appearance='${unsafeCSS(ChipAppearance.Active)}']) {
        --bg: var(--oryx-color-success-100);
        --c: var(--oryx-color-success-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Offline)}']) {
        --c: var(--oryx-color-neutral-300);
        --bg: var(--oryx-color-canvas-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Low)}']) {
        --bg: var(--oryx-chip-low-background-color, #fffbe6);
        --c: var(--oryx-chip-low-color, #cd8814);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Warning)}']) {
        --bg: var(--oryx-color-warning-100);
        --c: var(--oryx-color-warning-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Highlight)}']) {
        --bg: var(--oryx-color-highlight-100);
        --c: var(--oryx-color-highlight-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Info)}']) {
        --bg: var(--oryx-color-info-100);
        --c: var(--oryx-color-info-300);
      }

      :host([appearance='${unsafeCSS(ChipAppearance.Error)}']) {
        --bg: var(--oryx-color-error-100);
        --c: var(--oryx-color-error-300);
      }
    `,
  ],
};
