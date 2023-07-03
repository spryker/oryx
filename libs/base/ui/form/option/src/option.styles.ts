import { css } from 'lit';

export const optionStyles = css`
  :host([hidden]) {
    display: none;
  }

  :host {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 42px;
    box-sizing: border-box;
    padding: 9px 13px;
    list-style: none;
    border: solid 1px transparent;
    border-radius: var(--oryx-border-radius-small);
    outline: none;
    transition: background var(--oryx-transition-time-medium);
    cursor: pointer;
    color: var(--oryx-color-neutral-12);
  }

  oryx-icon.mark {
    --oryx-icon-size: var(--oryx-icon-size-sm);

    display: none;
    color: var(--oryx-color-primary-9);
    margin-inline-start: auto;
  }

  :host([active]) oryx-icon {
    display: flex;
  }

  :host(:hover),
  :host([highlight]) {
    background-color: var(--oryx-color-neutral-3);
  }

  :host([active]) {
    background-color: var(--oryx-color-primary-3);
  }

  :host(:not([active]):active) {
    background-color: var(--oryx-color-neutral-1);
  }

  :host(:active) {
    border-color: var(--oryx-color-primary-9);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-primary-9);
    transition: box-shadow, border;
    transition-duration: var(--oryx-transition-time);
  }

  :host([hide]) {
    padding: 0;
    max-height: 0;
    overflow: hidden;
    border: 0;
  }

  slot:not([name]) {
    display: inline;
  }

  mark {
    color: var(--oryx-color-primary-9);
  }
`;
