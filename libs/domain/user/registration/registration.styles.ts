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
    margin-block-start: 20px;
    margin-block-end: 30px;
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

  oryx-checkbox a {
    z-index: 1;
    position: relative;
  }

  oryx-button {
    grid-column: auto / span 2;
    width: 207px;
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
