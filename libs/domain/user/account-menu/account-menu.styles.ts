import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  oryx-button {
    --_height: 42px;
    border-block-end: 4px solid;
  }

  oryx-button:not(.active) {
    --_text-color: var(--oryx-color-neutral-12);
    border-color: transparent;
  }
`;
