import { css } from 'lit';

export const collapsibleBaseStyle = css`
  details[open] slot[name='expand-icon'],
  details:not([open]) slot[name='collapse-icon'] {
    display: none;
  }

  summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  summary::marker,
  summary::-webkit-details-marker {
    display: none;
  }
`;
