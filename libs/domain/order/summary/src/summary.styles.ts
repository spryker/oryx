import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const styles = css`
  h2 {
    margin: 32px 0;
  }

  .details-container {
    display: flex;
    flex-direction: column;
    gap: 17px;
  }

  oryx-button button {
    flex: initial;
  }

  .details {
    gap: 8px;
    display: grid;
    grid-template-columns: max-content auto;
  }

  .summary {
    align-items: center;
  }

  .details:first-of-type {
    grid-template-columns: 20px max-content auto;
    gap: 8px 6px;
  }

  .title {
    font-weight: 600;
  }

  h3 {
    margin-bottom: 4px;
  }

  hr,
  oryx-heading {
    grid-column: 1 / 3;
  }

  hr {
    border: none;
    border-top: 1px solid var(--oryx-color-canvas-300);
    margin: 20px 0;
    outline: none;
  }

  oryx-icon {
    color: var(--oryx-color-neutral-300);
  }
`;

const mediumScreen = css`
  .details-container {
    flex-direction: row;
  }

  .details {
    flex: 1;
  }

  oryx-button {
    align-self: end;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
