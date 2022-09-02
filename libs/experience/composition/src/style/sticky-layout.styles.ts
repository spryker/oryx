import { css } from 'lit';

export const stickyLayoutStyles = css`
  .sticky {
    position: sticky;

    /* trick to avoid full height compositions that block sticky compositions to work  */
    top: 0px;

    /* the height of a sticky composition is forced to default to 0% to overcome a
     * lengthy height which would block stickiness.
    */
    height: 0%;
  }
`;
