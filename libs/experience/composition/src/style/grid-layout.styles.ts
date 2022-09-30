import { css } from 'lit';

export const gridLayoutStyles = css`
  .grid-carousel {
    border: solid 1px red;
  }

  .grid-carousel > * {
    flex: 25%;
  }
`;
