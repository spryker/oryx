import { css } from 'lit';

export const styles = css`
  :host([variation='navigation']) oryx-button {
    --_height: 38px;

    border-block-end: 4px solid;
    white-space: nowrap;
  }

  :host([variation='navigation']) oryx-button:hover {
    background-color: var(--oryx-color-neutral-3);
  }

  :host([variation='navigation']) oryx-button:not(.active) {
    --_text-color: var(--oryx-color-neutral-12);

    border-color: transparent;
  }
`;
