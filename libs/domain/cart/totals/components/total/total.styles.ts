import { ThemeStylesheets } from '@spryker-oryx/experience';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const cartTotalsTotalRules = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
    padding-block-start: var(--oryx-space-2);
    border-block-start: solid 1px var(--oryx-color-neutral-6);
  }

  span:not(:last-child) {
    padding-block-end: 0;
  }

  span:nth-child(3) {
    padding-block-start: 0;
  }

  span:first-child {
    ${headingUtil(HeadingTag.H5)};
  }

  oryx-site-price {
    ${headingUtil(HeadingTag.H3)};
  }

  .tax-message {
    ${headingUtil(HeadingTag.H6)};

    flex: 100%;
    text-align: end;
    color: var(--oryx-color-neutral-9);
  }
`;

const cartTotalsTotalSmallStyles = css`
  span:first-child {
    ${headingUtil(HeadingTag.H3)};
  }

  oryx-site-price {
    ${headingUtil(HeadingTag.H1)};
  }

  .tax-message {
    ${headingUtil(HeadingTag.H4)};

    flex: 100%;
    text-align: end;
    color: var(--oryx-color-neutral-9);
  }
`;

export const cartTotalsTotalStyles: ThemeStylesheets = [
  cartTotalsTotalRules,
  ...screenCss({
    sm: cartTotalsTotalSmallStyles,
  }),
];
