import { css, unsafeCSS } from 'lit';
import { ChipType } from './chip.model';

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

  :host([type='${unsafeCSS(ChipType.INACTIVE)}']) {
    color: var(--oryx-chip-inactive-color, #71747c);
    background-color: var(--oryx-chip-inactive-background-color, #f8f8f8);
  }

  :host([type='${unsafeCSS(ChipType.SUCCESS)}']),
  :host([type='${unsafeCSS(ChipType.ONLINE)}']),
  :host([type='${unsafeCSS(ChipType.ACTIVE)}']) {
    color: var(--oryx-chip-success-color, #138671);
    background-color: var(--oryx-chip-success-background-color, #f1f8f7);
  }

  :host([type='${unsafeCSS(ChipType.OFFLINE)}']) {
    color: var(--oryx-chip-offline-color, #71747c);
    background-color: var(--oryx-chip-offline-background-color, #efeeee);
  }

  :host([type='${unsafeCSS(ChipType.LOW)}']) {
    color: var(--oryx-chip-low-color, #cd8814);
    background-color: var(--oryx-chip-low-background-color, #fffbe6);
  }

  :host([type='${unsafeCSS(ChipType.WARNING)}']) {
    color: var(--oryx-chip-warning-color, #b7540f);
    background-color: var(--oryx-chip-warning-background-color, #fef0e6);
  }

  :host([type='${unsafeCSS(ChipType.INFO)}']) {
    color: var(--oryx-chip-info-color, #2261af);
    background-color: var(--oryx-chip-info-background-color, #eaf1fa);
  }

  :host([type='${unsafeCSS(ChipType.ERROR)}']) {
    color: var(--oryx-chip-error-color, #c72712);
    background-color: var(--oryx-chip-error-background-color, #f9f2f1);
  }
`;
