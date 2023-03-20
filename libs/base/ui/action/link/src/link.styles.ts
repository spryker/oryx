import { css } from 'lit';

export const linkStyles = css`
  :host {
    --oryx-icon-size: 16px;

    display: inline-flex;
    align-items: center;
    color: var(--oryx-link-color, var(--oryx-color-primary-300));
  }

  :host([transparent]) ::slotted(a) {
    display: contents;
  }

  :host([transparent]),
  :host([transparent]) ::slotted(a:hover) {
    color: currentColor;
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
    padding: 4px 8px;
    text-decoration: none;
    outline: 0;
    border: solid 1px transparent;
    color: currentColor;
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

  :host(:hover:not([disabled])) {
    color: var(--oryx-link-color-hover, var(--oryx-color-primary-400));
  }

  :host(:not([disabled])) ::slotted(a:active),
  :host(:not([disabled])) ::slotted(a:focus-visible) {
    background-color: var(--oryx-color-canvas-200);
  }

  :host(:not([disabled])) ::slotted(a:active) {
    border: solid 1px var(--oryx-color-canvas-100);
  }

  :host(:not([disabled])) ::slotted(a:focus-visible) {
    box-shadow: 0 0 3px var(--oryx-color-primary-300);
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
