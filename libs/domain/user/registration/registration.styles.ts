import { css } from 'lit';

export const styles = css`
  oryx-notification {
    margin-block-end: 15px;
  }

  oryx-checkbox {
    display: flex;
    align-items: center;
    width: fit-content;
  }

  oryx-checkbox a {
    z-index: 1;
    position: relative;
  }

  oryx-button {
    grid-column: auto / span 2;
    width: 207px;
  }
`;
