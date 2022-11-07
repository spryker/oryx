import { Size } from '@spryker-oryx/utilities';
import { css } from 'lit';
import { carouselLayout } from './carousel-layout.styles';
import { columnLayout } from './column-layout.styles';
import { gridLayout } from './grid-layout.styles';
import { stickyLayout } from './sticky-layout.styles';

export const smallLayoutStyles = css`
  @layer layout {
    ${stickyLayout(Size.Sm)}
    ${columnLayout(Size.Sm)}
    ${gridLayout(Size.Sm)}
    ${carouselLayout(Size.Sm)}
  }
`;
