import { css, unsafeCSS } from 'lit';
import { NotificationPosition } from './notification-center.model';

export const notificationCenterBaseStyles = css`
  :host {
    --_max-width: min(
      calc(100% - (var(--oryx-notification-margin-inline, 0) * 2)),
      var(--oryx-notification-max-width, 0px)
    );

    display: flex;
    flex-direction: column;
  }

  :host([position]) {
    position: fixed;
    z-index: var(--oryx-notification-z-index, 1001);
    max-width: var(--_max-width);
    width: 100%;
  }

  :host([position='${unsafeCSS(NotificationPosition.TopStart)}']),
  :host([position='${unsafeCSS(NotificationPosition.TopEnd)}']),
  :host([position='${unsafeCSS(NotificationPosition.TopCenter)}']) {
    flex-direction: column-reverse;
    top: var(--oryx-notification-margin-block);
  }

  :host([position='${unsafeCSS(NotificationPosition.TopStart)}']),
  :host([position='${unsafeCSS(NotificationPosition.BottomStart)}']) {
    inset-inline-start: var(--oryx-notification-margin-inline);
  }

  :host([position='${unsafeCSS(NotificationPosition.TopCenter)}']),
  :host([position='${unsafeCSS(NotificationPosition.BottomCenter)}']) {
    inset-inline-start: calc((100% - var(--_max-width)) / 2);
  }

  :host([position='${unsafeCSS(NotificationPosition.TopEnd)}']),
  :host([position='${unsafeCSS(NotificationPosition.BottomEnd)}']) {
    inset-inline-end: var(--oryx-notification-margin-inline);
  }

  :host([position='${unsafeCSS(NotificationPosition.BottomStart)}']),
  :host([position='${unsafeCSS(NotificationPosition.BottomEnd)}']),
  :host([position='${unsafeCSS(NotificationPosition.BottomCenter)}']) {
    bottom: var(--oryx-notification-margin-block);
  }

  :host > * {
    margin-bottom: 10px;
    opacity: 0;
    transition-property: opacity;
    transition-duration: var(--oryx-transition-time-long);
  }

  :host([position='${unsafeCSS(NotificationPosition.BottomStart)}'])
    :last-child,
  :host([position='${unsafeCSS(NotificationPosition.BottomCenter)}'])
    :last-child,
  :host([position='${unsafeCSS(NotificationPosition.BottomEnd)}']) :last-child {
    margin-bottom: 0;
  }

  :host > [visible] {
    opacity: 1;
    transition-duration: var(--oryx-transition-time-medium);
  }
`;
