import { css } from 'lit';

export const merchantOffersStyles = css`
  :host {
    display: grid;
    gap: 16px;
  }

  a {
    text-decoration: none;
  }

  oryx-radio {
    align-items: start;
    margin-block-start: 2px;
  }

  input {
    margin-block-start: 2px;
  }

  input::after {
    z-index: 1;
  }
`;
