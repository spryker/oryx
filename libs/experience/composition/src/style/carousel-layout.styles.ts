import { css } from 'lit';

export const carouselLayoutStyles = css`
  .layout-carousel {
    display: flex;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    flex-direction: row;
    flex-wrap: nowrap;
    scroll-behavior: smooth;
    height: var(--height);
  }

  .layout-carousel > * {
    scroll-snap-align: start;
    flex: 0 0 calc(100% / var(--carousel-items, 4));
    height: var(--height, initial);
  }
`;
