import { css } from 'lit';

export const merchantOffersStyles = css`
  a {
    display: block;
    text-decoration: none;
  }

  a:not(:last-of-type) {
    margin-block-end: 16px;
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
