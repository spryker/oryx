import { css } from 'lit';

export const styles = css`
  :host {
    display: contents;
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
  source,
  ::slotted(*) {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  img,
  source,
  ::slotted(*) {
    object-fit: var(--image-fit, contain);
  }
`;
