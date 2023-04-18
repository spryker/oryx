import { css } from 'lit';

export const baseStyles = css`
  :host {
    --_col-span: var(--col-span);

    display: contents;
  }

  ::slotted(oryx-layout),
  oryx-layout {
    grid-column: var(--col-pos, auto) / span var(--_col-span);
  }
`;
