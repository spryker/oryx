import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const styles = css`
  h2 {
    margin-bottom: 33px;
  }

  .details-container {
    display: flex;
    gap: 17px;
  }

  oryx-button {
    align-self: end;
  }

  oryx-button button {
    flex: initial;
  }

  .details {
    gap: 10px;
    display: grid;
    align-items: center;
    grid-template-columns: max-content auto;
    flex: 1;
  }

  .details:first-of-type {
    grid-template-columns: 20px max-content auto;
    gap: 16px 6px;
  }

  .title {
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 1px solid var(--oryx-color-canvas-300);
    margin: 26px 0 20px;
    outline: none;
  }

  oryx-icon {
    color: var(--oryx-color-neutral-300);
  }
`;

const smallScreen = css`
  .details-container {
    flex-direction: column;
  }

  oryx-button {
    align-self: start;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
];
