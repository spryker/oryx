import { css } from 'lit';

export const chipBaseStyle = css`
  :host {
    display: inline-block;
    padding-inline: 12px;
    line-height: 24px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 24px;
    border-radius: 10px;
  }

  :host([dense]) {
    padding-inline: 7px;
  }

  slot {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  :host(:not([invert])) {
    color: var(--_c);
    background-color: var(--_b);
  }

  :host([invert]) {
    color: var(--_c-i, white);
    background-color: var(--_b-i);
  }

  :host(:not([appearance])) {
    --_c: var(--oryx-color-neutral-11);
    --_b: var(--oryx-color-neutral-6);
    --_c-i: var(--oryx-color-neutral-0);
    --_b-i: var(--oryx-color-neutral-9);
  }

  :host([appearance='success']) {
    --_c: var(--oryx-color-success-11);
    --_b: var(--oryx-color-success-3);
    --_c-i: var(--oryx-color-success-0);
    --_b-i: var(--oryx-color-success-9);
  }

  :host([appearance='info']) {
    --_c: var(--oryx-color-info-11);
    --_b: var(--oryx-color-info-3);
    --_c-i: var(--oryx-color-info-0);
    --_b-i: var(--oryx-color-info-9);
  }

  :host([appearance='error']) {
    --_c: var(--oryx-color-error-11);
    --_b: var(--oryx-color-error-3);
    --_c-i: var(--oryx-color-error-0);
    --_b-i: var(--oryx-color-error-9);
  }

  :host([appearance='warning']) {
    --_c: var(--oryx-color-warning-11);
    --_b: var(--oryx-color-warning-3);
    --_c-i: var(--oryx-color-warning-0);
    --_b-i: var(--oryx-color-warning-9);
  }
`;
