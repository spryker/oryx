import { css } from 'lit';

export const linkStyles = css`
  :host {
    --oryx-icon-size: 16px;

    display: inline-flex;
    align-items: center;
    color: var(--oryx-color-brand);
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 4px 8px;
    text-decoration: none;
    outline: 0;
    border: solid 1px transparent;
  }

  :host([disabled]) {
    pointer-events: none;
    color: var(--oryx-color-neutral-dark);
  }

  ::slotted(a) {
    color: currentColor;
  }

  :host(:hover:not([disabled])),
  :host(:focus-within:not([disabled])) {
    color: var(--oryx-color-brand-dark);
  }

  :host(:not([disabled])) ::slotted(a:focus) {
    background-color: var(--oryx-color-neutral-lighter);
    border: solid 1px var(--oryx-color-canvas);
  }

  :host(:not([disabled])) ::slotted(a:focus-visible) {
    box-shadow: 0 0 3px var(--oryx-color-brand);
  }

  /* additional space at the start whenever an icon is available */
  :host([icon]) ::slotted(a),
  :host([custom-icon]) ::slotted(a) {
    padding-inline-start: 32px;
  }

  :host([linktype='external']:not([disabled])) {
    color: var(--oryx-color-neutral-darker);
  }

  :host([linktype='external']:hover),
  :host([linktype='external']:focus-within) {
    color: var(--oryx-color-ink);
  }
`;
