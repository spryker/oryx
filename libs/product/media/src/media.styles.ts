import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size: 40px;

    line-height: 0;
  }

  :host(:not([fetched])) picture {
    visibility: hidden;
  }

  [part='fallback'] {
    color: var(--oryx-color-neutral-dark);
    margin: auto;
    width: 100%;
    height: 100%;
    background: var(--oryx-color-neutral-lighter);
  }

  picture {
    display: inline-block;
    overflow: hidden;
  }

  :host,
  picture,
  img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  picture,
  img {
    max-width: var(--image-max-width, 100%);
    max-height: var(--image-max-height, 100%);
  }

  img {
    object-fit: var(--image-fit, contain);
  }
`;
