import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { Breakpoint } from '@spryker-oryx/experience';
import { lgScreen, mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { Size } from '@spryker-oryx/utilities';
import { css, CSSResult } from 'lit';
import { baseLayoutScreenStyles, baseLayoutStyles } from './base-layout.styles';
import { carouselLayout } from './carousel-layout.styles';
import { columnLayout } from './column-layout.styles';
import { containerLayoutStyles } from './container-layout.styles';
import { gridLayout } from './grid-layout.styles';
import { stickyLayout } from './sticky-layout.styles';

const layoutStylesGenerator = (bp: Breakpoint): CSSResult => css`
  @layer layout {
    ${stickyLayout(bp)}
    ${columnLayout(bp)}
    ${gridLayout(bp)}
    ${carouselLayout(bp)}
  }
`;

const baseLayouts = css`
  ${stickyLayout()}
  ${columnLayout()}
  ${gridLayout()}
  ${carouselLayout()}
`;

/**
 * the ordering of styles is very important for their correct cascading
 * need to keep the order to prevent wrong priorities of styles,
 * especially for different sizes of the screens
 */
export const layoutStyles = [
  baseLayoutStyles,
  baseLayouts,
  containerLayoutStyles,
];

export const layoutScreenStyles: ThemeStylesWithMedia[] = [
  ...baseLayoutScreenStyles,
  {
    media: smScreen,
    css: layoutStylesGenerator(Size.Sm),
  },
  {
    media: mdScreen,
    css: layoutStylesGenerator(Size.Md),
  },
  {
    media: lgScreen,
    css: layoutStylesGenerator(Size.Lg),
  },
];
