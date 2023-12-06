import { css } from 'lit';

import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
export const checkoutOrchestratorStyles = css`
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
    ${headingUtil(HeadingTag.H5, { margin: '0 0 12px' })};

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
