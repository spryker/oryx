import { css } from 'lit';

export const storefrontLinkStyles = css`
  :host {
    position: relative;
    display: inline-flex;
  }

  :host([icon]) {
    --oryx-icon-size: 16px;

    align-items: baseline;
    gap: 8px;
  }

  :host([singleLine]) ::slotted(a) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  oryx-icon {
    position: relative;
    inset-block-start: 3px;
  }

  ::slotted(a) {
    text-decoration: none;
    color: currentColor;
  }

  :host(:hover) ::slotted(a) {
    text-decoration: solid underline currentColor 1px;
    text-underline-offset: 5px;
  }

  ::slotted(*:focus-visible) {
    outline: none;
  }

  ::slotted(*:focus-visible)::before {
    content: '';
    outline: solid 1px var(--oryx-color-focus);
    outline-offset: 5px;
    position: absolute;
    height: 100%;
    width: 100%;
    inset-inline-start: 0;
    inset-block-start: 0;
  }

  :host([color='primary']),
  :host([color='primary']:hover:not(:active)),
  :host(:active) {
    color: var(--oryx-color-primary-10);
  }
`;
