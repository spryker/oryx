import { css } from 'lit';

export const containerLayoutStyles = css`
  .container:not(.jumbotron) {
    margin: auto;
    max-width: var(--container-width);
  }

  .container.jumbotron {
    /* debatable! It conflicts with data driven padding */
    padding-inline: calc((100% - var(--container-width)) / 2);
  }
`;
