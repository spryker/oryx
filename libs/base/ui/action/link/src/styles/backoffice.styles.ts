import { css, unsafeCSS } from 'lit';
import { LinkType } from '../link.model';

const isNeutral = unsafeCSS(`[link-type='${LinkType.Neutral}']`);

export const backOfficeLinkStyles = css`
  :host(:not([size])) {
    --oryx-icon-size: 16px;
  }

  :host {
    display: inline-flex;
    align-items: baseline;
    position: relative;
    gap: 8px;
  }

  :host([singleLine]) ::slotted(a) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host(:not(${isNeutral})) {
    color: var(--oryx-link-color, var(--oryx-color-primary-9));
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

  :host([disabled]) {
    pointer-events: none;
    color: var(--oryx-color-neutral-9);
  }

  :host(:hover:not([disabled]):not(${isNeutral})) {
    color: var(--oryx-link-color-hover, var(--oryx-color-primary-10));
  }

  :host(:not([disabled])) ::slotted(a:active),
  :host(:not([disabled])) ::slotted(a:focus-visible) {
    background-color: var(--oryx-color-neutral-3);
  }

  :host(:not([disabled])) ::slotted(a:active) {
    border: solid 1px var(--oryx-color-neutral-1);
  }

  :host(:not([disabled])) ::slotted(a:focus-visible) {
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
  }

  /* additional space at the start whenever an icon is available */
  :host([icon]) ::slotted(a),
  :host([custom-icon]) ::slotted(a) {
    padding-inline-start: 32px;
  }

  :host([linktype='external']:not([disabled])) {
    color: var(--oryx-color-neutral-11);
  }

  :host([linktype='external']:hover) {
    color: var(--oryx-color-neutral-12);
  }
`;
