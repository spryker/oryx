import { css } from 'lit';

export const selectFilterStyles = css`
  [filterInput] {
    display: none;
    height: 38px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    width: 100%;
    padding: 7px 11px;
    background-color: transparent;
    border: none;
    outline: none;
    font: inherit;
    line-height: 24px;
    color: var(--oryx-color-neutral-12);
    border-radius: var(--oryx-border-radius);
    white-space: nowrap;
    overflow: hidden;
  }

  :host([filterSelect]) [filterInput] {
    display: initial;
  }

  :host([filterSelect]) ::slotted(select) {
    display: none;
  }
`;
