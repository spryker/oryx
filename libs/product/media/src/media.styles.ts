import { css } from 'lit';

export const styles = css`
  :host(:not([fetched])) picture {
    visibility: hidden;
  }

  :host([fallback]) {
    position: relative;
    max-width: var(--image-max-width, 100%);
    max-height: var(--image-max-height, 100%);
    height: 100%;
    width: 100%;
    background: var(--oryx-color-neutral-lighter);
  }

  oryx-icon {
    --oryx-icon-size: 100%;

    position: absolute;
    top: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
    max-width: 40px;
    max-height: 40px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    color: #b2b2b2;
  }

  picture {
    display: inline-block;
    max-width: var(--image-max-width, 100%);
    max-height: var(--image-max-height, 100%);
    line-height: 0;
    overflow: hidden;
  }

  :host,
  picture,
  img,
  source {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  img,
  source {
    object-fit: var(--image-fit, contain);
  }
`;
