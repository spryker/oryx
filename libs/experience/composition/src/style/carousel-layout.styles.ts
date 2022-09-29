import { css } from 'lit';

export const carouselLayoutStyles = css`
  [class*='-layout-carousel'] {
    --carousel-items: 1;

    display: flex;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    flex-direction: row;
    flex-wrap: nowrap;
    scroll-behavior: smooth;
    height: var(--height);
  }

  @media (min-width: 767px) {
    [class*='-layout-carousel'] {
      --carousel-items: 2;
    }
  }

  @media (min-width: 1024px) {
    [class*='-layout-carousel'] {
      --carousel-items: 4;
    }
  }

  /* .xs-layout-carousel * {
    border: solid 4px red;
    scroll-snap-align: start;
    flex: 0 0 calc(100% / var(--carousel-items, 4));
    height: var(--height, initial);
  } */
`;
