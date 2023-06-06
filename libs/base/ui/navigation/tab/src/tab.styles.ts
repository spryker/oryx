import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: flex;
    flex: 1 0 auto;
    min-height: 46px;
    min-width: 90px;
    border-block-end: 2px solid var(--oryx-color-neutral-6);
    color: var(--oryx-color-neutral-9);
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
    color: var(--oryx-color-neutral-12);
    border-color: var(--oryx-color-neutral-11);
  }

  :host([selected]) {
    border-color: var(--oryx-color-primary-9);
    color: var(--oryx-color-primary-9);
  }

  :host([selected][error]) {
    border-color: var(--oryx-color-error-9);
    color: var(--oryx-color-error-9);
  }

  :host(:not([selected])[error]:hover) {
    color: var(--oryx-color-error-9);
    background: none;
    border-color: var(--oryx-color-neutral-11);
  }

  :host(:not([selected])[error]) {
    border-color: var(--oryx-color-neutral-6);
    color: var(--oryx-color-error-9);
  }
`;

const smallScreen = css`
  :host {
    border-width: 4px;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
