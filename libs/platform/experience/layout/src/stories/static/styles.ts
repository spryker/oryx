import { css } from 'lit';

export const layoutStaticStyles = css`
  oryx-layout {
    --column-gap: 10px;
    background: var(--oryx-color-neutral-6);
  }

  oryx-layout div {
    color: var(--oryx-color-primary-9);
    background: var(--oryx-color-primary-3);
    padding: 10px;
  }

  pre {
    display: inline;
    color: var(--oryx-color-neutral-9);
  }

  ul {
    max-width: 500px;
  }
`;
