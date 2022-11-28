import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const floatingLabelBaseStyles = css`
  :host([floatLabel]) {
    position: relative;
  }

  :host([floatLabel]) slot[name='label']::slotted(*) {
    pointer-events: none;
  }

  :host([floatLabel]) slot[name='label'] {
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: var(--oryx-color-neutral-300);
    position: absolute;
    top: 17px;
    inset-inline-start: calc(var(--float-label-start-gap, 0px) + 13px);
    max-width: calc(100% - 26px - var(--float-label-start-gap, 0px));
    z-index: 1;
    transition: 100ms;
    /* stylelint-disable-next-line */
    background: linear-gradient(
      to bottom,
      transparent 10px,
      var(--_label-background-color) 10px
    );
  }

  :host(oryx-select[floatLabel]) slot[name='label'] {
    max-width: calc(100% - 54px - var(--float-label-start-gap, 0px));
  }

  :host([floatLabel]) slot:not([name])::slotted(*)::placeholder,
  :host([floatLabel]) slot:not([name])::slotted(select:invalid) {
    opacity: 0;
  }

  :host([floatLabel]) slot[name='label'],
  :host([floatLabel]) slot[name='label']::slotted(*) {
    cursor: text;
  }

  :host([floatLabel]:is(:focus-within, [has-value])) slot[name='label'] {
    --_label-background-color: var(--oryx-color-canvas-100);

    color: var(--oryx-color-neutral-400);
    font-size: 12px;
    padding: 3px 8px;
    top: -10px;
    inset-inline-start: 20px;
    max-width: calc(100% - 56px);
  }

  :host([floatLabel][has-prefix]:is(:focus-within, [has-value]))
    slot[name='label'] {
    inset-inline-start: calc(var(--float-label-start-gap, 0px) + 7px);
    max-width: calc(100% - 30px - calc(var(--float-label-start-gap, 0px)));
  }

  :host([floatLabel][has-value][disabled]) slot[name='label'] {
    --_label-background-color: var(--oryx-color-canvas-200);
  }
`;

const mediumScreen = css`
  :host([floatLabel]) slot[name='label'] {
    top: 13px;
  }
`;

export const floatingLabelScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
