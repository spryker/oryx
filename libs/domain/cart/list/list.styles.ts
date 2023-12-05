import { css } from 'lit';

export const cartListStyles = css`
  :host {
    display: grid;
    gap: 10px;
  }

  section {
    display: flex;
    justify-content: space-between;
  }

  p {
    text-wrap: initial;
    margin-block-start: 0;
  }
`;
