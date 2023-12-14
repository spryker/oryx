import { css } from 'lit';

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
    object-fit: var(--image-fit, contain);
    object-position: var(--image-position);
  }
`;
