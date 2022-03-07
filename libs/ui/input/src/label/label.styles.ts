import { css } from 'lit';

export const labelStyles = css`
  slot[name='label'] {
    cursor: inherit;
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
  }

  slot[name='label'] div {
    margin-bottom: 8px;
  }
`;
