import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const totalStyles = css`
  h2 {
    ${headingUtil(HeadingTag.H3)};

    margin-block-end: var(--oryx-space-4);
    display: var(--oryx-screen-small-hide, block);
  }

  experience-composition {
    display: grid;
    background-color: var(--oryx-color-canvas-200);
    padding-block: var(--oryx-space-4);
    border-radius: var(--oryx-border-radius-medium);
  }
`;
