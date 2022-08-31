import { css } from 'lit';

export const selectFloatingLabelStyles = css`
  :host([floatLabel]) slot[name='label'],
  :host([floatLabel]) slot[name='label']::slotted(*) {
    cursor: pointer;
  }
`;
