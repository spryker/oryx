import { css } from 'lit';

export const layoutStaticStyles = css`
  oryx-layout {
    --column-gap: 10px;
    background: var(--oryx-color-canvas-500);
  }

  oryx-layout div {
    color: var(--oryx-color-primary-300);
    background: var(--oryx-color-primary-100);
    padding: 10px;
  }

  pre {
    display: inline;
    color: var(--oryx-color-neutral-300);
  }

  ul {
    max-width: 500px;
  }
`;
