import { css } from 'lit';

export const styles = css`
  :host([appearance='dropdown']) {
    --oryx-button-color: var(--oryx-color-neutral-12);

    padding: 9px 5px;
    display: flex;
    height: 24px;
  }

  :host([appearance='dropdown']:hover) {
    background-color: var(--oryx-color-neutral-3);
  }
`;
