import { css } from 'lit';

export const styles = css`
  oryx-content-link::part(link) {
    margin-inline: -9px;
    padding-block: 0;
  }

  oryx-text {
    /* stylelint-disable-next-line */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--line-clamp);
    overflow: hidden;
  }
`;
