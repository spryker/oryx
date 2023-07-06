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
    background: var(--oryx-color-neutral-1);
  }

  :host([scheme='${unsafeCSS(Scheme.Dark)}']) {
    background: var(--oryx-color-neutral-3);
  }

  oryx-icon-button {
    grid-column: 3;
    --oryx-icon-color: initial;
  }

  :host([floating]) {
    box-shadow: var(--oryx-elevation-3) var(--oryx-color-elevation);
  }

  slot:not([name]) {
    display: block;
    grid-row: 1;
    align-self: center;
  }

  slot[name='subtext']::slotted(*) {
    padding-block-end: 5px;
    grid-row: 2;
    color: var(--oryx-color-neutral-9);
  }

  oryx-icon.illustrative {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }

  :host([type]) {
    border-color: var(--oryx-icon-color);
  }

  :host([type='info']) {
    --oryx-icon-color: var(--oryx-color-info-9);
  }

  :host([type='success']) {
    --oryx-icon-color: var(--oryx-color-success-9);
  }

  :host([type='warning']) {
    --oryx-icon-color: var(--oryx-color-warning-9);
  }

  :host([type='error']) {
    --oryx-icon-color: var(--oryx-color-error-9);
  }

  :host([type='info']) oryx-icon.illustrative {
    background: var(--oryx-color-info-3);
  }

  :host([type='success']) oryx-icon.illustrative {
    background: var(--oryx-color-success-3);
  }

  :host([type='warning']) oryx-icon.illustrative {
    background: var(--oryx-color-warning-3);
  }

  :host([type='error']) oryx-icon.illustrative {
    background: var(--oryx-color-error-3);
  }
`;
