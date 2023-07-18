import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const smallScreen = css`
  :host {
    min-width: 59px;
    min-height: 40px;
  }

  oryx-button {
    --oryx-icon-size: 20px;
  }

  a,
  button {
    border-radius: 0;
  }

  mark {
    inset-block-start: 2px;
    inset-inline-end: 2px;
    max-width: calc(100% - 4px);
  }
`;

export const navigationButtonScreenStyles = screenCss({
  sm: smallScreen,
});

export const siteNavigationButtonStyles = css`
  oryx-button::part(button),
  oryx-button::part(link) {
    --oryx-icon-size: 32px;

    position: relative;
    height: 68px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 5px;
  }

  oryx-button::part(button):hover,
  oryx-button::part(link):hover {
    background-color: var(--oryx-color-primary-10);
    border-color: var(--oryx-color-primary-10);
    box-shadow: none;
  }

  mark {
    position: absolute;
    box-sizing: border-box;
    line-height: 16px;
    min-width: 6px;
    padding: 1px 6px;
    border-radius: 2px;
    text-align: center;
    background: var(--oryx-color-secondary-9);
    color: var(--oryx-color-secondary-0, white);
    inset-block-start: 6px;
    inset-inline-end: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 16px);
  }
`;
