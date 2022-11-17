import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: flex;
    flex: 1 0 auto;
    min-height: 46px;
    min-width: 90px;
    border-block-end: 4px solid var(--oryx-color-neutral-light);
    color: var(--oryx-color-neutral-dark);
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
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([selected]) {
    border-color: var(--oryx-color-brand);
    color: var(--oryx-color-brand);
  }

  :host([selected][error]) {
    border-color: var(--oryx-color-error);
    color: var(--oryx-color-error);
  }

  :host(:not([selected])[error]:hover) {
    color: var(--oryx-color-error);
    background: none;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host(:not([selected])[error]) {
    border-color: var(--oryx-color-neutral-light);
    color: var(--oryx-color-error);
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
