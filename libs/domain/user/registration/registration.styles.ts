import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  :host {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
  }

  oryx-heading,
  oryx-notification,
  form {
    grid-column: auto / span 2;
  }

  oryx-layout {
    --column-gap: 20px;
    --row-gap: 15px;
    --oryx-column-grid: 2;
    --oryx-grid-item-size: 1fr;
  }

  oryx-button[type='outline'] {
    margin-block-end: 10px;
  }

  oryx-input:last-of-type {
    margin-block-start: 5px;
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
`;

const smallScreen = css`
  oryx-input {
    grid-column: span 2;
  }

  oryx-button:not([type='outline']) {
    grid-column: auto / span 2;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
