import { ThemeStylesheets } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

const cartTotalRules = css`
  :host {
    display: flex;
    justify-content: space-between;
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
    padding-block: var(--oryx-space-2);
  }

  span {
    ${headingUtil(HeadingTag.H3)};
  }
`;

export const cartTotalsStyles: ThemeStylesheets = [
  cartTotalRules,
  { media: smScreen, css: smallScreenRules },
];

const cartTotalsDiscountRules = css`
  oryx-collapsible {
    padding-block: var(--oryx-space-2);
    box-sizing: border-box;
    width: 100%;
  }

  span {
    padding-block: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: var(--oryx-space-2) 0 0 0;
    color: var(--oryx-color-neutral-300);
  }

  li {
    display: flex;
    justify-content: space-between;
  }

  span:nth-child(2) {
    margin-inline-start: auto;
    color: var(--oryx-color-highlight-400);
  }
`;

export const cartTotalsDiscountStyles: ThemeStylesheets = [
  cartTotalsDiscountRules,
];

const cartTotalsTotalRules = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
    padding-block-start: var(--oryx-space-2);
    border-block-start: solid 1px var(--oryx-color-canvas-500);
  }

  span:not(:last-child) {
    padding-block-end: 0;
  }

  span:last-child {
    padding-block-start: 0;
  }

  span:first-child {
    ${headingUtil(HeadingTag.H5)};
  }

  span:nth-child(2) {
    ${headingUtil(HeadingTag.H3)};
  }

  .tax-message {
    ${headingUtil(HeadingTag.H6)};

    flex: 100%;
    text-align: end;
    color: var(--oryx-color-neutral-300);
  }
`;

const cartTotalsTotalSmallStyles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
    padding-block-start: var(--oryx-space-2);
    border-block-start: solid 1px var(--oryx-color-canvas-500);
  }

  span:first-child {
    ${headingUtil(HeadingTag.H3)};
  }

  span:nth-child(2) {
    ${headingUtil(HeadingTag.H1)};
  }

  .tax-message {
    ${headingUtil(HeadingTag.H4)};

    flex: 100%;
    text-align: end;
    color: var(--oryx-color-neutral-300);
  }
`;

export const cartTotalsTotalStyles: ThemeStylesheets = [
  cartTotalsTotalRules,
  { media: smScreen, css: cartTotalsTotalSmallStyles },
];
