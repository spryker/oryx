import { css, unsafeCSS } from 'lit';
import { Schemes, Types } from './notification.model';

export const notificationStyles = css`
  :host {
    display: flex;
    align-items: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-inline: 15px 16px;
    border-inline-start: 6px solid;
    border-radius: var(--oryx-border-radius-small);
  }

  :host([type='${unsafeCSS(Types.INFO)}']) {
    --_notification-icon-overlay: var(--oryx-color-accent-light);

    border-inline-start-color: var(--oryx-color-info);
  }

  :host([type='${unsafeCSS(Types.SUCCESS)}']) {
    --_notification-icon-overlay: var(--oryx-color-brand-lighter);

    border-inline-start-color: var(--oryx-color-success);
  }

  :host([type='${unsafeCSS(Types.WARNING)}']) {
    --_notification-icon-overlay: var(--oryx-color-orange-light);

    border-inline-start-color: var(--oryx-color-warning);
  }

  :host([type='${unsafeCSS(Types.ERROR)}']) {
    --_notification-icon-overlay: var(--oryx-color-pink-light);

    border-inline-start-color: var(--oryx-color-error);
  }

  :host([floating]) {
    box-shadow: var(--oryx-elevation-3) var(--oryx-elevation-color);
  }

  :host([scheme='${unsafeCSS(Schemes.LIGHT)}']) {
    background: var(--oryx-color-canvas);
  }

  :host([scheme='${unsafeCSS(Schemes.DARK)}']) {
    background: var(--oryx-color-neutral-lighter);
  }

  :host > oryx-icon {
    padding: 7px;
    border-radius: 50%;
    background: var(--_notification-icon-overlay);
  }

  slot {
    display: flex;
    flex-direction: column;
    padding: 7px 0;
    padding-inline: 10px 9px;
    line-height: 24px;
    color: var(--oryx-color-ink);
  }

  ::slotted(:not(:first-child)) {
    color: var(--oryx-color-neutral-dark);
  }

  button {
    all: unset;
    margin-top: 6px;
    margin-inline-start: auto;
    color: var(--oryx-color-neutral-dark);
    cursor: pointer;
  }
`;
