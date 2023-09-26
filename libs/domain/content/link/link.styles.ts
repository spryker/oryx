import { css } from 'lit';

export const contentLinkStyles = css`
  :host {
    display: block;
  }

  :host(:not(:hover)) oryx-composition {
    opacity: 0;
    pointer-events: none;
  }

  :host oryx-composition {
    /* padding: 10px; */
  }

  a {
    padding-inline: var(--navigation-padding);
  }
`;
