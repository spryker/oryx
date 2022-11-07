import { Size } from '@spryker-oryx/utilities';
import { css } from 'lit';
import { carouselLayout } from './carousel-layout.styles';
import { columnLayout } from './column-layout.styles';
import { gridLayout } from './grid-layout.styles';
import { stickyLayout } from './sticky-layout.styles';

export const largeLayoutStyles = css`
  @layer layout {
    @media (min-width: 1024px) {
      ${stickyLayout(Size.Lg)}
      ${columnLayout(Size.Lg)}
        ${gridLayout(Size.Lg)}
        ${carouselLayout(Size.Lg)}
    }
  }
`;
