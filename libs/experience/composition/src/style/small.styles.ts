import { Breakpoint } from '@spryker-oryx/experience';
import { css } from 'lit';
import { carouselLayout } from './carousel-layout.styles';
import { columnLayout } from './column-layout.styles';
import { gridLayout } from './grid-layout.styles';
import { stickyLayout } from './sticky-layout.styles';

export const smallLayoutStyles = css`
  @layer layout {
    ${stickyLayout(Breakpoint.Xs)}
    ${columnLayout(Breakpoint.Xs)}
    ${gridLayout(Breakpoint.Xs)}
    ${carouselLayout(Breakpoint.Xs)}
  }
`;
