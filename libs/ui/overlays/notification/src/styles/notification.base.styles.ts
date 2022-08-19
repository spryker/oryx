import { css } from 'lit';

export const notificationBaseStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 17px;
    padding-bottom: 17px;
    padding-inline: 15px 15px;
  }

  :host([closable]) {
    padding-inline-end: 49px;
  }

  slot {
    line-height: 24px;
  }

  button {
    all: unset;
    position: absolute;
    top: 16px;
    inset-inline-end: 16px;
    cursor: pointer;
  }
`;
