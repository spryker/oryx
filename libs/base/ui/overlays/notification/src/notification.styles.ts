import { css, unsafeCSS } from 'lit';
import { Scheme } from './notification.model';

export const notificationStyles = css`
  :host {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    padding-block: 10px;
    padding-inline: 22px 15px;
    border-radius: var(--oryx-border-radius-small);
    line-height: 24px;
    border-inline-start: 6px solid transparent;
    box-sizing: border-box;
  }

  :host([scheme='${unsafeCSS(Scheme.Light)}']),
  :host(:not([scheme])) {
    background: var(--oryx-color-canvas-100);
  }

  :host([scheme='${unsafeCSS(Scheme.Dark)}']) {
    background: var(--oryx-color-canvas-200);
  }

  oryx-icon-button {
    grid-column: 3;
  }

  :host([floating]) {
    box-shadow: var(--oryx-elevation-3) var(--oryx-elevation-color);
  }

  slot:not([name]) {
    display: block;
    grid-row: 1;
    align-self: center;
  }

  slot[name='subtext']::slotted(*) {
    padding-block-end: 5px;
    grid-row: 2;
    color: var(--oryx-color-neutral-300);
  }

  oryx-icon.illustrative {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }

  :host([type='info']) {
    border-color: var(--oryx-color-info-300);
  }

  :host([type='success']) {
    border-color: var(--oryx-color-success-300);
  }

  :host([type='warning']) {
    border-color: var(--oryx-color-warning-300);
  }

  :host([type='error']) {
    border-color: var(--oryx-color-error-300);
  }

  :host([type='info']) oryx-icon.illustrative {
    background: var(--oryx-color-info-100);
  }

  :host([type='success']) oryx-icon.illustrative {
    background: var(--oryx-color-success-100);
  }

  :host([type='warning']) oryx-icon.illustrative {
    background: var(--oryx-color-warning-100);
  }

  :host([type='error']) oryx-icon.illustrative {
    background: var(--oryx-color-error-100);
  }
`;
