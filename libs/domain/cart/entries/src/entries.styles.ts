import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

const deprecatedHeadingStyles = css`
  oryx-heading {
    text-align: var(--oryx-typography-h1-align);
  }

  h1 {
    ${headingUtil(HeadingTag.H3)}

    margin-block-end: 20px;
  }
`;

export const cartEntriesStyles = css`
  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-neutral-6);
  }

  ${deprecatedHeadingStyles}
`;
