import { css } from 'lit';

export const videoStyles = css`
  :host {
    display: block;
  }

  video,
  object {
    width: 100%;
    height: 100%;
    aspect-ratio: var(--aspect-ratio, 16/9);
    object-fit: cover;
  }
`;
