import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const smallScreen = css`
  a,
  button {
    --oryx-icon-size: 24px;

    padding: 6px;
    height: 38px;
    width: auto;
  }

  oryx-heading {
    display: none;
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
  oryx-button::part(button) {
    --oryx-icon-size: 32px;

    position: relative;
    height: 68px;
    width: 62px;
    max-width: 62px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 5px;
    padding: 12px 8px;
  }

  oryx-button::part(button):hover {
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
