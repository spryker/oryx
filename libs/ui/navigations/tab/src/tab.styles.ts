import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: flex;
    flex: 1 0 auto;
    min-height: 46px;
    min-width: 90px;
    border-block-end: 4px solid var(--oryx-color-canvas-500);
    color: var(--oryx-color-neutral-300);
    background: none;
    line-height: var(--oryx-line-height-base);
    padding: 0 24px;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    margin: 0;
    gap: 4px;
  }

  :host(:not([selected]):hover) {
    color: var(--oryx-color-ink);
    border-color: var(--oryx-color-neutral-400);
  }

  :host([selected]) {
    border-color: var(--oryx-color-primary-300);
    color: var(--oryx-color-primary-300);
  }

  :host([selected][error]) {
    border-color: var(--oryx-color-error-300);
    color: var(--oryx-color-error-300);
  }

  :host(:not([selected])[error]:hover) {
    color: var(--oryx-color-error-300);
    background: none;
    border-color: var(--oryx-color-neutral-400);
  }

  :host(:not([selected])[error]) {
    border-color: var(--oryx-color-canvas-500);
    color: var(--oryx-color-error-300);
  }
`;

const mediumScreen = css`
  :host {
    border-width: 2px;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
