import { css } from 'lit';

export const compositionStyles = css`
  :host {
    display: contents;
  }

  :host,
  section {
    width: 100%;
  }

  oryx-heading {
    /* we like this to be part of oryx-heading, but it's currently blocked by line clamp feature */
    display: flex;
    align-items: center;
    margin-block-end: 12px;
  }

  oryx-checkout-manage-address {
    margin-inline-start: auto;
  }
`;
