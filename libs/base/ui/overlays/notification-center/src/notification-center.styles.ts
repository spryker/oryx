import { css, unsafeCSS } from 'lit';
import { NotificationPosition as Position } from './notification-center.model';

export const notificationCenterBaseStyles = css`
  :host {
    --_max-width: min(
      calc(100% - (var(--oryx-notification-margin-inline, 0px) * 2)),
      var(--oryx-notification-max-width, 400px)
    );

    display: flex;
    flex-direction: column;
  }

  :host([stackable]:hover) {
    --_margin: 3px;
    --_max-height: 58px;
    --_opacity: 1;
  }

  :host([stackable]) oryx-notification {
    transition: all var(--oryx-transition-time) ease-in-out;
  }

  :host([stackable]:is([position='${unsafeCSS(
          Position.TopStart
        )}'], [position='${unsafeCSS(
          Position.TopCenter
        )}'], [position='${unsafeCSS(Position.TopEnd)}']))
    oryx-notification:not(:last-child) {
    margin-block-start: var(--_margin, -58px);
    max-height: var(--_max-height, 30px);
  }

  :host([stackable]:is([position='${unsafeCSS(
          Position.BottomStart
        )}'], [position='${unsafeCSS(
          Position.BottomCenter
        )}'], [position='${unsafeCSS(Position.BottomEnd)}']))
    oryx-notification:not(:last-child) {
    max-height: var(--_max-height, 30px);
  }

  :host([stackable]:is([position='${unsafeCSS(
          Position.BottomStart
        )}'], [position='${unsafeCSS(
          Position.BottomEnd
        )}'], [position='${unsafeCSS(Position.BottomCenter)}']))
    oryx-notification:not(:first-child) {
    margin-block-start: var(--_margin, -58px);
  }

  oryx-notification[visible] {
    opacity: 1;
  }

  :host([stackable]) oryx-notification[visible]:not(:last-child) {
    opacity: var(--_opacity, 0.4);
  }

  :host([position]) {
    position: fixed;
    z-index: var(--oryx-notification-z-index, 1001);
    max-width: var(--_max-width);
    width: 100%;
  }

  :host([position='${unsafeCSS(Position.TopStart)}']),
  :host([position='${unsafeCSS(Position.TopEnd)}']),
  :host([position='${unsafeCSS(Position.TopCenter)}']) {
    flex-direction: column-reverse;
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

  :host([position='${unsafeCSS(Position.BottomStart)}']),
  :host([position='${unsafeCSS(Position.BottomEnd)}']),
  :host([position='${unsafeCSS(Position.BottomCenter)}']) {
    inset-block-end: var(--oryx-notification-margin-block, 0);
  }

  :host > * {
    margin-block-end: 10px;
    opacity: 0;
    transition-property: opacity;
    transition-duration: var(--oryx-transition-time-long);
  }

  :host([position='${unsafeCSS(Position.BottomStart)}']) :last-child,
  :host([position='${unsafeCSS(Position.BottomCenter)}']) :last-child,
  :host([position='${unsafeCSS(Position.BottomEnd)}']) :last-child {
    inset-block-end: 0;
  }

  :host > [visible] {
    transition-duration: var(--oryx-transition-time-medium);
  }
`;
