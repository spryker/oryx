import { css } from 'lit';

export const linkStyles = css`
  :host {
    --oryx-icon-size: 16px;

    display: inline-flex;
    align-items: baseline;
    position: relative;
  }

  :host([singleLine]) ::slotted(a) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
