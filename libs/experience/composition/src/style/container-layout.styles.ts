import { css } from 'lit';

export const containerLayoutStyles = css`
  :is(.container, .xs-container, .md-container, .lg-container):not(:is(.xs-jumbotron, .md-jumbotron, .lg-jumbotron)) {
    margin: auto;
    max-width: var(--container-width);
  }

  :is(.container, .xs-container, .md-container, .lg-container):is(.xs-jumbotron, .md-jumbotron, .lg-jumbotron) {
    /* debatable! It conflicts with data driven padding */
    padding-inline: calc((100% - var(--container-width)) / 2);
  }
`;
