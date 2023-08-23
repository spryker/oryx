import { css } from 'lit';

export const styles = css`
  oryx-button[variation='navigation'] {
    --_height: 38px;

    border-block-end: 4px solid;
    white-space: nowrap;
  }

  oryx-button[variation='navigation']:hover {
    background-color: var(--oryx-color-neutral-3);
  }

  oryx-button[variation='navigation']:not(.active) {
    --_text-color: var(--oryx-color-neutral-12);

    border-color: transparent;
  }
`;
