import { css } from 'lit';

export const storefrontLinkStyles = css`
  oryx-icon {
    position: relative;
    top: 2px;
  }

  ::slotted(*) {
    text-decoration: none;
    color: currentColor;
  }

  :host(:hover) oryx-icon,
  :host(:hover) ::slotted(*) {
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: currentColor;
    text-decoration-thickness: 1px;
  }

  :host(:hover) ::slotted(*) {
    text-underline-offset: 4px;
  }

  ::slotted(*:focus-visible) {
    outline: none;
  }

  ::slotted(*:focus-visible)::before {
    content: '';
    outline: solid 1px var(--oryx-color-focus);
    outline-offset: 3px;
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
  }

  oryx-icon::after,
  ::slotted(oryx-icon)::after {
    content: 'a';
    color: transparent;
    letter-spacing: -3px;
  }

  oryx-icon {
    padding-inline-start: 6px;
  }

  :host([color='primary']),
  :host(:active) {
    color: var(--oryx-color-primary-10);
  }

  :host(:hover:not(:active)) {
    color: var(--oryx-color-primary-9);
  }

  :host([color='light']) {
    color: var(--oryx-color-neutral-0);
  }

  :host([color='light']:hover) {
    text-decoration-color: var(--oryx-color-primary-7);
    color: var(--oryx-color-primary-7);
  }

  :host([color='light']:active) {
    text-decoration-color: var(--oryx-color-neutral-0);
    color: var(--oryx-color-neutral-0);
  }
`;
