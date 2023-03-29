import { ThemeStylesheets } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

const cartTotalRules = css`
  :host {
    display: grid;
    grid-template-columns: 1fr max-content;
    // display: flex;
    // justify-content: space-between;
    padding-inline: var(--oryx-space-4);
  }

  span {
    ${headingUtil(HeadingTag.H6)};

    padding-block: var(--oryx-space-2);
  }
`;

const smallScreenRules = css`
  :host {
    display: flex;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
  }

  span {
    ${headingUtil(HeadingTag.H3)};
  }
`;

export const cartTotalsStyles: ThemeStylesheets = [
  cartTotalRules,
  { media: smScreen, css: smallScreenRules },
];
