import { css, unsafeCSS } from 'lit';
import { ChipAppearance } from './chip.model';

export const styles = css`
  :host {
    display: inline-block;
    padding-inline: 12px;
    line-height: 24px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 24px;
    border-radius: var(--oryx-border-radius);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--oryx-chip-color, #71747c);
    background-color: var(--oryx-chip-background-color, #efeeee);
  }

  :host([dense]) {
    padding-inline: 7px;
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Inactive)}']) {
    color: var(--oryx-chip-inactive-color, #71747c);
    background-color: var(--oryx-chip-inactive-background-color, #f8f8f8);
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Success)}']),
  :host([appearance='${unsafeCSS(ChipAppearance.Online)}']),
  :host([appearance='${unsafeCSS(ChipAppearance.Active)}']) {
    color: var(--oryx-chip-success-color, #138671);
    background-color: var(--oryx-chip-success-background-color, #f1f8f7);
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Offline)}']) {
    color: var(--oryx-chip-offline-color, #71747c);
    background-color: var(--oryx-chip-offline-background-color, #efeeee);
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Low)}']) {
    color: var(--oryx-chip-low-color, #cd8814);
    background-color: var(--oryx-chip-low-background-color, #fffbe6);
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Warning)}']) {
    color: var(--oryx-chip-warning-color, #b7540f);
    background-color: var(--oryx-chip-warning-background-color, #fef0e6);
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Info)}']) {
    color: var(--oryx-chip-info-color, #2261af);
    background-color: var(--oryx-chip-info-background-color, #eaf1fa);
  }

  :host([appearance='${unsafeCSS(ChipAppearance.Error)}']) {
    color: var(--oryx-chip-error-color, #c72712);
    background-color: var(--oryx-chip-error-background-color, #f9f2f1);
  }
`;
