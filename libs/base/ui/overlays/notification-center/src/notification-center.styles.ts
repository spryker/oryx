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
    --delay: 0s;
    --_max-width: min(
      calc(100% - (var(--oryx-notification-margin-inline, 0px) * 2)),
      var(--oryx-notification-max-width, 400px)
    );

    display: grid;
  }

  :host[stackable] {
    --delay: calc(var(--oryx-transition-time) * 2);
  }

  :host([position]) {
    position: fixed;
    z-index: var(--oryx-notification-z-index, 1001);
    max-width: 470px;
    width: 100%;
  }

  :host(${isTop}) {
    inset-block-start: 40px;
  }

  :host(${isBottom}) {
    inset-block-end: 40px;
  }

  :host([position='${unsafeCSS(Position.TopStart)}']),
  :host([position='${unsafeCSS(Position.BottomStart)}']) {
    inset-inline-start: 30px;
  }

  :host([position='${unsafeCSS(Position.TopCenter)}']),
  :host([position='${unsafeCSS(Position.BottomCenter)}']) {
    inset-inline-start: calc((100% - var(--_max-width)) / 2);
  }

  :host([position='${unsafeCSS(Position.TopEnd)}']),
  :host([position='${unsafeCSS(Position.BottomEnd)}']) {
    inset-inline-end: 30px;
  }

  :host > * {
    margin-block-start: 10px;
    overflow: hidden;
    transition: margin-block-end var(--oryx-transition-time),
      opacity var(--oryx-transition-time),
      max-height var(--oryx-transition-time) var(--delay),
      padding-block var(--oryx-transition-time) var(--delay),
      margin-block-start var(--oryx-transition-time) var(--delay),
      margin-inline var(--oryx-transition-time) var(--delay);
    transition-timing-function: ease;
  }

  :host([stackable]) > * {
    max-height: 100px;
  }

  :host([stackable]) > *:first-of-type {
    z-index: 2;
  }

  :host([stackable]) > *:nth-of-type(2) {
    z-index: 1;
  }

  :host([stackable]) > *:nth-of-type(n + 4) {
    z-index: -1;
  }

  :host > *:not([visible]) {
    opacity: 0;
    margin-block-end: -68px;
  }

  :host([stackable]) > *:not([visible]) ~ * {
    --delay: 0s;
  }

  :host([stackable]) > *[visible] ~ *,
  :host([stackable]) > *:nth-of-type(n + 3) {
    max-height: 58px;
    margin-block-start: -45px;
    margin-inline: var(--gap, 10px);
  }

  :host([stackable]) > *[visible] ~ *:nth-of-type(n + 4) {
    max-height: 0;
    margin-block-start: 0;
    padding-block: 0;
  }

  :host([stackable]) > *[visible] ~ *:nth-of-type(n + 3),
  :host([stackable]) > *:nth-of-type(n + 4) {
    margin-inline: calc(2 * var(--gap, 10px));
  }

  :host([stackable]) > *:nth-of-type(n + 2) span[slot='subtext'] {
    opacity: 0;
    transition: all var(--oryx-transition-time) var(--delay) ease;
  }

  :host([stackable]:hover) oryx-notification[visible]:nth-of-type(n + 1) {
    --delay: 0s;

    margin-block-start: 10px;
    max-height: 200px;
    margin-inline: 0;
  }

  :host([stackable]:hover) > *:nth-of-type(n + 2) span[slot='subtext'] {
    opacity: 1;
  }
`;
