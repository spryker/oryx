import { css, unsafeCSS } from 'lit';
import { NotificationPosition as Position } from './notification-center.model';

const isTop = unsafeCSS(
  `:is([position='${Position.TopStart}'], [position='${Position.TopCenter}'], [position='${Position.TopEnd}'])`
);
const isBottom = unsafeCSS(
  `:is([position='${Position.BottomStart}'], [position='${Position.BottomCenter}'], [position='${Position.BottomEnd}'])`
);

export const notificationCenterBaseStyles = css`
  :host {
    --_max-width: min(
      calc(100% - (var(--oryx-notification-margin-inline, 0px) * 2)),
      var(--oryx-notification-max-width, 400px)
    );

    display: flex;
    flex-direction: column-reverse;
  }

  :host([stackable]:hover) {
    --_margin: 3px;
    --_max-height: 58px;
    --_opacity: 1;
  }

  :host([stackable]) oryx-notification,
  :host([stackable]) oryx-notification * {
    transition: all var(--oryx-transition-time) ease-in-out;
  }

  :host([stackable]) oryx-notification {
    margin-block-start: var(--_margin, -58px);
    max-height: var(--_max-height, 24px);
  }

  :host([stackable]) oryx-notification:last-child {
    margin-block-start: initial;
    max-height: initial;
  }

  :host([stackable]) oryx-notification:not(:last-child) span[slot='subtext'] {
    opacity: 0;
  }

  :host([stackable]:hover)
    oryx-notification:not(:last-child)
    span[slot='subtext'] {
    opacity: 1;
  }

  :host([position]) {
    position: fixed;
    z-index: var(--oryx-notification-z-index, 1001);
    max-width: var(--_max-width);
    width: 100%;
  }

  :host > * {
    margin-block-end: 13px;
  }

  :host(${isTop}) {
    inset-block-start: var(--oryx-notification-margin-block);
  }

  :host([position='${unsafeCSS(Position.TopStart)}']),
  :host([position='${unsafeCSS(Position.BottomStart)}']) {
    inset-inline-start: var(--oryx-notification-margin-inline, 0);
  }

  :host([position='${unsafeCSS(Position.TopCenter)}']),
  :host([position='${unsafeCSS(Position.BottomCenter)}']) {
    inset-inline-start: calc((100% - var(--_max-width)) / 2);
  }

  :host([position='${unsafeCSS(Position.TopEnd)}']),
  :host([position='${unsafeCSS(Position.BottomEnd)}']) {
    inset-inline-end: var(--oryx-notification-margin-inline, 0);
  }

  :host(${isBottom}) {
    inset-block-end: var(--oryx-notification-margin-block, 0);
  }

  :host(${isBottom}) :last-child {
    inset-block-end: 0;
  }

  :host > [visible] {
    transition-duration: var(--oryx-transition-time-medium);
  }
`;
