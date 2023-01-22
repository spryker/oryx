import { css } from 'lit';

export const baseStyles = css`
  :host {
    --layout-cols: var(--cols);

    display: contents;
  }

  oryx-layout {
    --cols: var(--layout-cols);
  }
`;
