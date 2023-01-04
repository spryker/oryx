import { css } from 'lit';

export const styles = css`
  content-link::part(wrapper) {
    display: contents;
  }

  content-link::part(link) {
    margin-inline: -9px;
    padding-block: 0;
  }
`;
