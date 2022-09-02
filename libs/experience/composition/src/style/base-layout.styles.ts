import { css } from 'lit';

export const baseLayoutStyles = css`
  :host {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    /* we cannot use overflow hidden when there's a sticky child */
    /* overflow: hidden; */
  }

  :host > * {
    height: var(--height);
  }

  :host > * {
    flex: 100%;

    /* ensure the items will be aligned at the start by default */
    align-content: start;
  }
`;
