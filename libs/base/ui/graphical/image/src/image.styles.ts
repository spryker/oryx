import { OBJECT_FIT, OBJECT_POSITION } from '@spryker-oryx/ui';
import { css, unsafeCSS } from 'lit';

const objectFit = unsafeCSS(`var(${OBJECT_FIT}, contain)`);
const objectPosition = unsafeCSS(`var(${OBJECT_POSITION})`);

export const styles = css`
  :host {
    display: contents;
  }

  svg,
  ::slotted(svg) {
    height: 100%;
    width: 100%;
  }

  [part='fallback'] {
    --oryx-icon-size: var(--oryx-image-fallback-size, 100px);

    color: var(--oryx-color-neutral-9);
    background-color: var(--oryx-image-fallback-background);
    border-radius: var(--oryx-border-radius-small);
    margin: auto;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    max-width: var(--image-max-width, 100%);
    max-height: var(--image-max-height, 100%);
    object-position: ${objectPosition};
    object-fit: ${objectFit};
  }
`;
