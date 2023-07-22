import { css } from 'lit';

export const dropdownStyles = css`
  :host([open]) slot[name='trigger'] {
    --oryx-button-border: solid 1px var(--oryx-color-neutral-10);
    --oryx-button-background: var(--oryx-color-neutral-3);
  }
`;
