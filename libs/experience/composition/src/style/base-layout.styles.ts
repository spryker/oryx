import { css } from 'lit';

export const baseLayoutStyles = css`
  @layer layout {
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      box-sizing: border-box;
      min-width: 0;
      /* we cannot use overflow hidden when there's a sticky child */
      /* overflow: hidden; */
      gap: var(--oryx-composition-gap);
    }

    :host > * {
      height: var(--height);
    }

    :host > * {
      flex: 100%;

      /* ensure the items will be aligned at the start by default */
      align-content: start;
    }
  }
`;
