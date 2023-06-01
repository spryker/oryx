import { primaryColorBase, primaryColorLighter } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const layoutStaticStyles = css`
  oryx-layout {
    --column-gap: 10px;
    background: var(--oryx-color-neutral-6);
  }

  oryx-layout div {
    color: ${primaryColorBase};
    background: ${primaryColorLighter};
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
