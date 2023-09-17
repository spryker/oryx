import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  oryx-layout {
    --column-gap: 20px;
    --row-gap: 15px;
    --oryx-column-grid: 2;
    --oryx-grid-item-size: 1fr;
  }

  oryx-button {
    width: 207px;
  }

  oryx-button[type='outline'] {
    margin-block-start: 20px;
    margin-block-end: 30px;
  }

  oryx-input:last-of-type {
    margin-block-start: 5px;
  }

  h1 {
    margin-block-end: 20px;
  }

  oryx-notification {
    margin-block-end: 15px;
  }

  oryx-checkbox {
    display: flex;
    align-items: center;
    width: fit-content;
  }

  oryx-password-input {
    margin-block: 15px 5px;
  }

  oryx-checkbox a {
    z-index: 1;
    position: relative;
  }

  oryx-button:not([type='outline']) {
    margin-block-start: 5px;
    grid-column: auto / span 2;
  }
`;

const smallScreen = css`
  oryx-input {
    grid-column: span 2;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
