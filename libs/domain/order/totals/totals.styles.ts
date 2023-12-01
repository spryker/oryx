import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const orderTotalStyles = css`
  h2 {
    ${headingUtil(HeadingTag.H3, { margin: '0 0 var(--oryx-space-4)' })};

    display: var(--oryx-screen-small-hide, block);
  }

  oryx-composition {
    display: grid;
    background-color: var(--oryx-color-neutral-3);
    padding-block: var(--oryx-space-4);
    border-radius: var(--oryx-border-radius-medium);
  }
`;
