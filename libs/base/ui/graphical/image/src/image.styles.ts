import { css } from 'lit';

export const styles = css`
  svg,
  ::slotted(svg) {
    height: 100%;
    width: 100%;
    fill: currentColor;
  }

  [part='fallback'] {
    --oryx-icon-size: 100px;

    color: var(--oryx-color-neutral-300);
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
  }
`;
