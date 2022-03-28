import { css } from 'lit';

export const labelStyles = css`
  slot[name='label'] {
    cursor: inherit;
    color: var(--oryx-color-ink);
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
  }

  slot[name='label'] div {
    margin-bottom: 8px;
  }
`;
