import { css } from 'lit';

export const videoStyles = css`
  video,
  object {
    width: 100%;
    aspect-ratio: var(--aspect-ratio, 16/9);
    height: var(--height);
    object-fit: cover;
  }
`;
