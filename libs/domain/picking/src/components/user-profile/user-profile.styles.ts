import { css } from 'lit';

export const userProfileComponentStyles = css`
  :host {
    display: grid;
    gap: 10px;
  }

  .info-block {
    display: grid;
    text-align: start;
    min-height: 400px;

    .info-label {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      text-transform: uppercase;
    }

    .info-value {
      margin-block-start: 6px;
      margin-inline-start: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
  }

  oryx-notification {
    margin-block-end: 10px;
  }
`;
