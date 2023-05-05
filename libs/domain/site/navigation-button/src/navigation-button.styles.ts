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

export const styles = css`
  :host {
    min-width: 75px;
    min-height: 68px;
    max-width: 154px;
    display: inline-flex;
    flex-direction: column;
    position: relative;
  }

  oryx-button {
    --oryx-icon-size: 32px;

    flex: 1 0 auto;
    flex-direction: column;
    align-items: stretch;
  }

  a,
  button {
    display: grid;
    justify-items: center;
    gap: 5px;
    padding: 6px;
    border: solid 2px transparent;
    box-sizing: border-box;
  }

  :is(a, button):hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  :is(a, button):focus-visible {
    border-color: var(--oryx-color-canvas-100);
    outline: solid 1px blue;
    outline-offset: -3px;
  }

  :is(a, button):active {
    background-color: var(--oryx-color-primary-500);
    box-shadow: none;
  }

  oryx-heading {
    display: var(--oryx-screen-small-hide, initial);
  }

  mark {
    position: absolute;
    box-sizing: border-box;
    line-height: 16px;
    min-width: 6px;
    padding: 1px 6px;
    border-radius: 2px;
    text-align: center;
    background: var(--oryx-color-secondary-300);
    color: var(--oryx-color-neutral-500);
    inset-block-start: 6px;
    inset-inline-end: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 16px);
  }
`;
