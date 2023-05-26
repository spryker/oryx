import { primaryColor } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';
import { LinkType } from './link.model';

const isNeutral = unsafeCSS(`[link-type='${LinkType.Neutral}']`);

export const linkStyles = css`
  :host {
    --oryx-icon-size: 16px;

    display: inline-flex;
    align-items: center;
  }

  :host(:not(${isNeutral})) {
    color: var(--oryx-link-color, ${primaryColor()});
  }

  :host(${isNeutral}) ::slotted(a) {
    display: contents;
  }

  oryx-icon,
  ::slotted(oryx-icon) {
    position: absolute;
    padding-inline-start: 8px;
    color: inherit;
    pointer-events: none;
  }

  ::slotted(a) {
    border-radius: var(--oryx-border-radius-large);
    text-decoration: none;
    outline: 0;
    border: solid 1px transparent;
    color: currentColor;
  }

  ::slotted(*),
  oryx-icon,
  ::slotted(oryx-icon) {
    padding: 4px 8px;
  }

  :host(:not([multiLine])) ::slotted(a) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([disabled]) {
    pointer-events: none;
    color: var(--oryx-color-neutral-300);
  }

  :host(:hover:not([disabled]):not(${isNeutral})) {
    color: var(--oryx-link-color-hover, ${primaryColor('dark')});
  }

  :host(:not([disabled])) ::slotted(a:active),
  :host(:not([disabled])) ::slotted(a:focus-visible) {
    background-color: var(--oryx-color-canvas-200);
  }

  :host(:not([disabled])) ::slotted(a:active) {
    border: solid 1px var(--oryx-color-canvas-100);
  }

  :host(:not([disabled])) ::slotted(a:focus-visible) {
    box-shadow: 0 0 3px ${primaryColor()};
  }

  /* additional space at the start whenever an icon is available */
  :host([icon]) ::slotted(a),
  :host([custom-icon]) ::slotted(a) {
    padding-inline-start: 32px;
  }

  :host([linktype='external']:not([disabled])) {
    color: var(--oryx-color-neutral-400);
  }

  :host([linktype='external']:hover) {
    color: var(--oryx-color-ink);
  }
`;
