import { css } from 'lit';

import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
export const compositionStyles = css`
  :host {
    display: contents;
  }

  :host > * {
    width: 100%;
  }

  oryx-checkout-manage-address {
    margin-inline-start: auto;
  }

  h2 {
    ${headingUtil(HeadingTag.H5)};

    display: flex;
    align-items: center;
    margin-block-end: 12px;
    justify-content: space-between;
  }
`;
