import { css, unsafeCSS } from 'lit';
import { ChipType } from './chip.model';

export const styles = css`
  :host {
    display: inline-block;
    padding-inline: 12px;
    line-height: 24px;
    border-radius: var(--oryx-border-radius);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  @media (prefers-color-scheme: light) {
    :host {
      color: var(--chip-color, #71747c);
      background-color: var(--chip-background-color, #efeeee);
    }

    :host([type='${unsafeCSS(ChipType.INACTIVE)}']) {
      color: var(--chip-inactive-color, #71747c);
      background-color: var(--chip-inactive-background-color, #f8f8f8);
    }

    :host([type='${unsafeCSS(ChipType.SUCCESS)}']),
    :host([type='${unsafeCSS(ChipType.ONLINE)}']),
    :host([type='${unsafeCSS(ChipType.ACTIVE)}']) {
      color: var(--chip-success-color, #138671);
      background-color: var(--chip-success-background-color, #f1f8f7);
    }

    :host([type='${unsafeCSS(ChipType.OFFLINE)}']) {
      color: var(--chip-offline-color, #71747c);
      background-color: var(--chip-offline-background-color, #efeeee);
    }

    :host([type='${unsafeCSS(ChipType.LOW)}']) {
      color: var(--chip-low-color, #cd8814);
      background-color: var(--chip-low-background-color, #fffbe6);
    }

    :host([type='${unsafeCSS(ChipType.WARNING)}']) {
      color: var(--chip-warning-color, #b7540f);
      background-color: var(--chip-warning-background-color, #fef0e6);
    }

    :host([type='${unsafeCSS(ChipType.INFO)}']) {
      color: var(--chip-info-color, #2261af);
      background-color: var(--chip-info-background-color, #eaf1fa);
    }

    :host([type='${unsafeCSS(ChipType.ERROR)}']) {
      color: var(--chip-error-color, #c72712);
      background-color: var(--chip-error-background-color, #f9f2f1);
    }
  }

  @media (prefers-color-scheme: dark) {
    :host {
      background-color: var(--chip-color, #71747c);
      color: var(--chip-background-color, #efeeee);
    }

    :host([type='${unsafeCSS(ChipType.INACTIVE)}']) {
      background-color: var(--chip-inactive-color, #71747c);
      color: var(--chip-inactive-background-color, #f8f8f8);
    }

    :host([type='${unsafeCSS(ChipType.SUCCESS)}']),
    :host([type='${unsafeCSS(ChipType.ONLINE)}']),
    :host([type='${unsafeCSS(ChipType.ACTIVE)}']) {
      background-color: var(--chip-success-color, #138671);
      color: var(--chip-success-background-color, #f1f8f7);
    }

    :host([type='${unsafeCSS(ChipType.OFFLINE)}']) {
      background-color: var(--chip-offline-color, #71747c);
      color: var(--chip-offline-background-color, #efeeee);
    }

    :host([type='${unsafeCSS(ChipType.LOW)}']) {
      background-color: var(--chip-low-color, #cd8814);
      color: var(--chip-low-background-color, #fffbe6);
    }

    :host([type='${unsafeCSS(ChipType.WARNING)}']) {
      background-color: var(--chip-warning-color, #b7540f);
      color: var(--chip-warning-background-color, #fef0e6);
    }

    :host([type='${unsafeCSS(ChipType.INFO)}']) {
      background-color: var(--chip-info-color, #2261af);
      color: var(--chip-info-background-color, #eaf1fa);
    }

    :host([type='${unsafeCSS(ChipType.ERROR)}']) {
      background-color: var(--chip-error-color, #c72712);
      color: var(--chip-error-background-color, #f9f2f1);
    }
  }
`;
