import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const smallScreen = css`
  oryx-button::part(button) {
    --oryx-icon-size: 24px;

    height: 38px;
    min-width: 38px;
    max-width: auto;
    width: auto;
    gap: 0;
    padding: 0;
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

  oryx-button:hover::part(button) {
    background-color: var(--oryx-color-primary-10);
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
