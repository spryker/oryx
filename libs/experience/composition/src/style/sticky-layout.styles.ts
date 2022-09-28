import { css, unsafeCSS } from 'lit';

const rules = `
    position: sticky;

    /* trick to avoid full height compositions that block sticky compositions to work  */
    top: 0px;
    
    /* the height of a sticky composition is forced to default to 0% 
     * to overcome a lengthy height which would block stickiness. */
    height: 0%;
`;

export const stickyLayoutStyles = css`
  .xs-sticky {
    ${unsafeCSS(rules)};
  }

  @media (min-width: 767px) {
    .md-sticky {
      ${unsafeCSS(rules)};
    }
  }

  @media (min-width: 1008px) {
    .lg-sticky {
      ${unsafeCSS(rules)};
    }
  }
`;
