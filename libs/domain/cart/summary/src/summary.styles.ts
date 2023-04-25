import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const mediumScreen = css`
  :host {
    --oryx-icon-size: 32px;

    width: 75px;
  }

  oryx-heading {
    display: block;
  }

  mark {
    inset-block-start: 3px;
    inset-inline-end: 3px;
  }
`;

const smallScreen = css`
  :host {
    width: 59px;
  }

  oryx-heading {
    display: none;
  }

  mark {
    inset-block-start: -2px;
    inset-inline-end: -2px;
  }
`;

export const cartSummaryScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
  {
    media: smScreen,
    css: smallScreen,
  },
];

export const styles = css`
  a {
    --oryx-icon-size: 32px;

    position: relative;
    display: grid;
    justify-items: center;
    gap: 5px;
    padding: 6px;
    max-width: 75px;
    width: 75px;
    border: solid 2px transparent;
  }

  a:hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  a:focus-visible {
    outline: solid 1px blue;
  }

  mark {
    position: absolute;
    line-height: 18px;
    min-width: 6px;
    padding: 1px 6px;
    border-radius: 2px;
    text-align: center;
    background: var(--oryx-color-secondary-300);
    color: var(--oryx-color-accent-light-0, white);
  }
`;
