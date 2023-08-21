import { css } from 'lit';

export const styles = css`
  oryx-button {
    --_height: 38px;

    border-block-end: 4px solid;
  }

  oryx-button:not(.active) {
    --_text-color: var(--oryx-color-neutral-12);

    border-color: transparent;
  }
`;
