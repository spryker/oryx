import { css } from 'lit';

export const navigationItemStyles = css`
  :host {
    color: var(--oryx-color-neutral-dark);
    display: flex;
    box-sizing: border-box;
    padding: 16px 17px;
    gap: 13px;
    outline: none;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 250px;
    transition: all var(--oryx-transition-time);
    margin-inline-start: calc(var(--navigation-collapsed) * 19px);
  }

  :host(:hover) {
    background-color: var(--oryx-color-neutral-lighter);
    color: var(--oryx-color-neutral-darker);
  }

  .text {
    display: flex;
    transition: all var(--oryx-transition-time);
    /* stylelint-disable */
    opacity: calc((var(--navigation-collapsed) - 1) * -1);
  }

  :host([active]:not([active='false'])) {
    color: var(--oryx-color-brand);
    pointer-events: none;
  }

  :host([active]:not([active='false']))::before {
    content: '';
    background-color: var(--oryx-color-brand);
    position: absolute;
    inset-inline-start: 0;
    height: 36px;
    width: 4px;
    border-radius: 4px;
  }

  ::slotted(*) {
    display: contents;
    text-decoration: none;
    color: inherit;
  }

  ::slotted(oryx-icon) {
    border: solid 1px blue;
  }
`;
