import { css } from 'lit';

export const styles = css`
  oryx-heading {
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
  }

  oryx-modal::part(close) {
    --oryx-icon-size: 24px;
    --_margin: 0;

    padding: 0;
    max-height: 26px;
  }

  [slot="footer"] {
    flex-grow: 1;
  }
`;
