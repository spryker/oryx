import { Breakpoint } from '@spryker-oryx/experience';
import { css } from 'lit';
import { carouselLayout } from './carousel-layout.styles';
import { columnLayout } from './column-layout.styles';
import { gridLayout } from './grid-layout.styles';
import { stickyLayout } from './sticky-layout.styles';

export const mediumLayoutStyles = css`
  @layer layout {
    @media (min-width: 768px) {
      ${stickyLayout(Breakpoint.Md)}
      ${columnLayout(Breakpoint.Md)}
        ${gridLayout(Breakpoint.Md)}
        ${carouselLayout(Breakpoint.Md)}
    }
  }
`;
