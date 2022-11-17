import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { lgScreen, mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const contentBaseStyles = css`
  product-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  product-title,
  product-id {
    margin: 0 0 2px;
    padding-inline-end: calc(var(--oryx-space-2) * 3);
  }

  .seller {
    margin-bottom: var(--oryx-space-4);
  }

  .seller,
  .row {
    display: flex;
  }

  .seller,
  product-id {
    color: var(--oryx-color-neutral-darker);
  }

  .seller :last-child {
    color: var(--oryx-color-brand);
    margin-inline-start: var(--oryx-space-2);
  }

  cart-entry-price oryx-icon {
    --oryx-icon-size: 11px;

    color: var(--oryx-color-neutral-darker);
    margin-inline-end: 3.5px;
  }

  section {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--oryx-space-2);
  }

  .col {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1 1;
  }

  .col:first-child {
    margin-bottom: var(--oryx-space-2);
  }

  .readonly-quantity {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .readonly-quantity :first-child {
    font-size: 12px;
    line-height: 16px;
    color: var(--oryx-color-neutral-darker);
  }
`;

const mediumScreen = css`
  h3 {
    font-size: 14px;
    line-height: inherit;
    padding-inline-end: calc(var(--oryx-space-2) * 3);
  }

  .seller {
    margin-bottom: var(--oryx-space-2);
  }
`;

const largeScreen = css`
  section {
    flex-direction: row;
  }

  .col:first-child {
    margin-bottom: 0;
    margin-inline-end: 13px;
  }

  .col:last-child {
    margin-inline-start: 13px;
  }

  .readonly-quantity {
    flex-basis: 50%;
  }
`;

export const contentScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
  {
    media: lgScreen,
    css: largeScreen,
  },
];
