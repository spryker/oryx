import { css } from 'lit';

export const notificationBaseStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-block: 17px;
    padding-inline: 15px 15px;
  }

  :host([closable]) {
    padding-inline-end: 49px;
  }

  slot {
    line-height: 24px;
  }

  oryx-icon-button {
    position: absolute;
    inset-block-start: 16px;
    inset-inline-end: 16px;
    cursor: pointer;
  }
`;
