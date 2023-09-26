import { css } from 'lit';

export const siteNavigationStyles = css`
  oryx-composition {
    outline: solid 4px blue;
  }

  oryx-composition::slotted(*) {
    outline: solid 4px yellow;
  }

  oryx-content-link {
    outline: solid 4px yellow;
  }
`;
