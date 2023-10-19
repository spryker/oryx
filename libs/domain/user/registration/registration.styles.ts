import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  oryx-notification {
    margin-block-end: 20px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 15px;
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

  oryx-button {
    margin-block-start: 5px;
    width: 100%;
  }
`;

const smallScreen = css`
  oryx-input {
    grid-column: span 2;
  }

  oryx-button {
    grid-column: auto / span 2;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
