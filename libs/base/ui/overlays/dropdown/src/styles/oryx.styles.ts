import { css } from 'lit';

export const dropdownStyles = css`
  :host([open]) slot[name='trigger'] oryx-icon-button :is(a, button) {
    border-color: var(--oryx-color-neutral-8);
    background: var(--oryx-color-neutral-3);
  }
`;
