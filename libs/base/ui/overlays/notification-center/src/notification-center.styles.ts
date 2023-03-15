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
    flex-direction: column;
    box-sizing: border-box;
  }

  :host([position]) {
    position: fixed;
    z-index: var(--oryx-notification-z-index, 1001);
    max-width: var(--_max-width);
    width: 100%;
  }

  :host(${isTop}) {
    inset-block-start: var(--oryx-notification-margin-block);
  }

  :host(${isBottom}) {
    inset-block-end: var(--oryx-notification-margin-block, 0);
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

  oryx-notification {
    transition: all var(--oryx-transition-time) ease-in-out;
    transform-origin: bottom center;
    transform: scaleY(var(--_scale, var(--_scale-y, 1)));
    margin-inline: var(--_m, 0);
  }

  oryx-notification:nth-child(1) {
    z-index: 3;
  }

  oryx-notification:nth-child(2) {
    z-index: 2;
  }

  :host(:is(:not([stackable]), :host([stackable]:hover)))
    > *:not(:first-child) {
    margin-block-start: 10px;
    margin-inline: 0;
  }

  :host([stackable]:hover) > * {
    transform: scale(1);
  }

  :host([stackable]) > * {
    margin-block-start: var(--_margin-block-start, -45px);
  }

  :host([stackable]) > *:nth-child(n + 4) {
    --_margin-block-start: -58px;
    --_scale-y: 0;
  }

  :host([stackable]:hover) > *:nth-child(n + 2) {
    max-height: 1000px;
  }

  :host([stackable]) > *:nth-child(n + 2) {
    max-height: 58px;
  }

  :host([stackable]) > *:nth-child(2) {
    --_m: 10px;
  }

  :host([stackable]) > *:nth-child(n + 3) {
    --_m: 20px;
  }

  :host([stackable]) > *:nth-child(n + 2) span[slot='subtext'] {
    opacity: 0;
    transition: all var(--oryx-transition-time) ease-in-out;
  }

  :host([stackable]:hover) > *:nth-child(n + 2) span[slot='subtext'] {
    opacity: 1;
  }
`;
