import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const smallScreen = css`
  :host,
  oryx-menu-item-button {
    min-width: 59px;
  }

  mark {
    inset-block-start: 2px;
    inset-inline-end: 2px;
  }
`;

export const navigationButtonScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
];

export const styles = css`
  :host {
    min-width: 75px;
    max-width: 154px;
    display: inline-flex;
    flex-direction: column;
    position: relative;
  }

  oryx-button {
    flex: 1 0 auto;
  }

  oryx-button > * {
    --oryx-icon-size: 32px;

    display: grid;
    justify-items: center;
    gap: 5px;
    padding: 6px;
    border: solid 2px transparent;
    box-sizing: border-box;
  }

  oryx-button > :hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  oryx-button > :focus-visible {
    border-color: var(--oryx-color-canvas-100);
    outline: solid 1px blue;
    outline-offset: -3px;
  }

  oryx-heading {
    display: var(--oryx-screen-small-hide, initial);
  }

  mark {
    position: absolute;
    line-height: 16px;
    min-width: 6px;
    padding: 1px 6px;
    border-radius: 2px;
    text-align: center;
    background: var(--oryx-color-secondary-300);
    color: var(--oryx-color-neutral-500);
    inset-block-start: 6px;
    inset-inline-end: 8px;
  }
`;
