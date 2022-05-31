import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  :host([single-line]) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([single-line]) > * {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
