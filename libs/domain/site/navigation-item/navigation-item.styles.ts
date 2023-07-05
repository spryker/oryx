import { css } from 'lit';

export const styles = css`
  :host {
    max-width: var(--width, none);
  }

  :host,
  oryx-dropdown {
    display: flex;
    flex-direction: column;
  }

  oryx-button,
  oryx-site-navigation-button,
  oryx-dropdown {
    align-self: stretch;
  }

  oryx-dropdown {
    --oryx-popover-maxwidth: 188px;
  }
`;
