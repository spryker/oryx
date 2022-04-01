import { css, unsafeCSS } from 'lit';
import { Positions } from './notification-center.model';

export const notificationCenterBaseStyles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  :host([position]) {
    position: fixed;
    z-index: var(--oryx-notification-z-index, 1001);
    max-width: 470px;
    width: 100%;
  }

  :host([position='${unsafeCSS(Positions.TOP_START)}']),
  :host([position='${unsafeCSS(Positions.TOP_END)}']) {
    flex-direction: column-reverse;
  }

  :host([position='${unsafeCSS(Positions.TOP_START)}']) {
    top: 40px;
    inset-inline-start: 30px;
  }

  :host([position='${unsafeCSS(Positions.TOP_END)}']) {
    top: 40px;
    inset-inline-end: 30px;
  }

  :host([position='${unsafeCSS(Positions.BOTTOM_START)}']) {
    bottom: 40px;
    inset-inline-start: 30px;
  }

  :host([position='${unsafeCSS(Positions.BOTTOM_END)}']) {
    bottom: 40px;
    inset-inline-end: 30px;
  }

  :host > * {
    margin-bottom: 10px;
    opacity: 0%;
    transition-property: opacity;
    transition-duration: var(--oryx-transition-time-long);
  }

  :host > [visible] {
    opacity: 100%;
    transition-duration: var(--oryx-transition-time-medium);
  }
`;
