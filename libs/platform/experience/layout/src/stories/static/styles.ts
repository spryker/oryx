import { css } from 'lit';

export const layoutStaticStyles = css`
  oryx-layout {
    --gap: 10px;
    background: var(--oryx-color-canvas-500);
  }

  oryx-layout div {
    background: var(--oryx-color-primary-100);
    padding: 10px;
  }

  ul {
    max-width: 500px;
  }
`;
