import { css } from 'lit';

export const containerLayoutStyles = css`
  :is(.container, .xs-container, .md-container, .lg-container):not(.jumbotron) {
    margin: auto;
    max-width: var(--container-width);
    /* padding: var(--container-padding, 10px); */
  }

  :is(.container, .xs-container, .md-container, .lg-container).jumbotron {
    /* debatable! It conflicts with data driven padding */
    padding-inline: calc((100% - var(--container-width)) / 2);
  }
`;
