import { css } from 'lit';

export const facetNavigation = css`
  oryx-collapsible {
    width: 100%;
    border: none;
  }

  li:has(ul) {
    display: contents;
  }
`;
