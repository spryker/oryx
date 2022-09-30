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

  content-link::part(link) {
    margin-inline-start: -8px;
    padding-block: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }
`;
