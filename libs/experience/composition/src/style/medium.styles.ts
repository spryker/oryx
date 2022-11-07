import { Size } from '@spryker-oryx/utilities';
import { css } from 'lit';
import { carouselLayout } from './carousel-layout.styles';
import { columnLayout } from './column-layout.styles';
import { gridLayout } from './grid-layout.styles';
import { stickyLayout } from './sticky-layout.styles';

export const mediumLayoutStyles = css`
  @layer layout {
    @media (min-width: 768px) {
      ${stickyLayout(Size.Md)}
      ${columnLayout(Size.Md)}
        ${gridLayout(Size.Md)}
        ${carouselLayout(Size.Md)}
    }
  }
`;
