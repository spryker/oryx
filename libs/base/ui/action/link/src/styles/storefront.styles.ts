import { css } from 'lit';

export const storefrontLinkStyles = css`
  oryx-icon {
    position: relative;
    inset-block-start: 2px;
    padding-inline-start: 6px;
  }

  ::slotted(*) {
    text-decoration: none;
    color: currentColor;
  }

  :host(:hover) oryx-icon,
  :host(:hover) ::slotted(*) {
    text-decoration: underline;
    text-underline-offset: 2px;
    /* stylelint-disable-next-line */
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
    inset-inline-start: 0;
  }

  oryx-icon::after,
  ::slotted(oryx-icon)::after {
    content: 'a';
    color: transparent;
    letter-spacing: -3px;
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
    color: var(--oryx-color-primary-7);
  }

  :host([color='light']:active) {
    color: var(--oryx-color-neutral-0);
  }
`;
