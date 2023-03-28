import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { lgScreen, mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

const smallScreen = css`
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

const mediumPlusScreen = css`
  :host {
    display: flex;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
    padding-block: var(--oryx-space-2);
  }
  span {
    ${headingUtil(HeadingTag.H6)};
  }
`;

export const cartTotalsDiscountStyles = css`
  oryx-collapsible {
    box-sizing: border-box;
    width: 100%;
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

export const cartTotalsDiscountScreenStyles: ThemeStylesWithMedia[] = [
  { media: smScreen, css: smallScreen },
  { media: smScreen, css: cartTotalsDiscountStyles },
  { media: mdScreen, css: cartTotalsDiscountStyles },
  { media: mdScreen, css: mediumPlusScreen },
  { media: lgScreen, css: cartTotalsDiscountStyles },
  { media: lgScreen, css: mediumPlusScreen },
];

export const cartTotalsScreenStyles: ThemeStylesWithMedia[] = [
  { media: smScreen, css: smallScreen },
  { media: mdScreen, css: mediumPlusScreen },
  { media: lgScreen, css: mediumPlusScreen },
];

const cartTotalsTotalStyles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
    padding-block-start: var(--oryx-space-2);
    border-block-start: solid 1px var(--oryx-color-canvas-500);
  }

  span:first-child {
    ${headingUtil(HeadingTag.H5)};
  }

  span:nth-child(2) {
    ${headingUtil(HeadingTag.H3)};
  }
  .tax-message {
    flex: 100%;
    text-align: end;
    ${headingUtil(HeadingTag.H6)};
    color: var(--oryx-color-neutral-300);
  }
`;

const cartTotalsTotalSmStyles = css`
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
    flex: 100%;
    text-align: end;
    ${headingUtil(HeadingTag.H4)};
    color: var(--oryx-color-neutral-300);
  }
`;

export const cartTotalsTotalScreenStyles: ThemeStylesWithMedia[] = [
  { media: smScreen, css: cartTotalsTotalSmStyles },
  { media: mdScreen, css: cartTotalsTotalStyles },
  { media: lgScreen, css: cartTotalsTotalStyles },
];
