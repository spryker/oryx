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
    inset-block-start: 40px;
    inset-inline-start: 30px;
  }

  :host([position='${unsafeCSS(Positions.TOP_END)}']) {
    inset-block-start: 40px;
    inset-inline-end: 30px;
  }

  :host([position='${unsafeCSS(Positions.BOTTOM_START)}']) {
    inset-block-end: 40px;
    inset-inline-start: 30px;
  }

  :host([position='${unsafeCSS(Positions.BOTTOM_END)}']) {
    inset-block-end: 40px;
    inset-inline-end: 30px;
  }

  /* TODO: refactor with theme BP's */
  @media (max-width: 530px) {
    :host([position='${unsafeCSS(Positions.TOP_END)}']),
    :host([position='${unsafeCSS(Positions.TOP_START)}']),
    :host([position='${unsafeCSS(Positions.BOTTOM_START)}']),
    :host([position='${unsafeCSS(Positions.BOTTOM_END)}']) {
      max-width: calc(100% - 60px);
    }
  }

  :host > * {
    margin-block-end: 10px;
    opacity: 0;
    transition-property: opacity;
    transition-duration: var(--oryx-transition-time-long);
  }

  :host([position='${unsafeCSS(Positions.BOTTOM_START)}']) :last-child,
  :host([position='${unsafeCSS(Positions.BOTTOM_END)}']) :last-child {
    margin-block-end: 0;
  }

  :host > [visible] {
    opacity: 1;
    transition-duration: var(--oryx-transition-time-medium);
  }
`;
