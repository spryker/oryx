import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    --oryx-radio-size: 18px;
  }

  ::slotted(input) {
    width: var(--oryx-radio-size);
    height: var(--oryx-radio-size);
    appearance: none;
    border-radius: 50%;
    margin: 0;
    padding: 2px;
    border: solid 2px currentColor;
    color: var(--oryx-color-neutral-200);
  }

  ::slotted(input:checked) {
    background-clip: content-box;
    /* stylelint-disable-next-line */
    background-image: linear-gradient(currentColor 0%, currentColor 100%);
    color: var(--oryx-color-primary-300);
  }

  :not(slot[name='subtext'])::slotted(*) {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ::slotted(input)::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    cursor: pointer;
  }

  ::slotted(input:hover) {
    color: var(--oryx-color-neutral-300);
  }

  ::slotted(input:focus-visible) {
    outline: 0;
    box-shadow: 0 0 3px var(--oryx-color-focus);
    border-color: var(--oryx-color-focus);
  }

  :host([hasError]) ::slotted(input:focus-visible) {
    border-color: var(--oryx-color-error-300);
  }

  ::slotted(input:disabled),
  ::slotted(input:checked:disabled) {
    background-color: var(--oryx-color-canvas-200);
    color: var(--oryx-color-neutral-300);
    border-color: var(--oryx-color-canvas-500);
    pointer-events: none;
  }

  ::slotted(input:checked:hover) {
    color: var(--oryx-color-primary-400);
  }

  :host([hasError]) ::slotted(input),
  :host([hasError]) ::slotted(input:checked) {
    border-color: var(--oryx-color-error-300);
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: css`
      :host {
        --oryx-radio-size: 24px;
      }
    `,
  },
];
