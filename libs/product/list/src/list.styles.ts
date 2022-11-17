import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { layoutScreenStyles } from '@spryker-oryx/experience/composition';
import { lgScreen, mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    padding-inline: 4px;
    scroll-padding-inline: 4px;
  }

  :host(.xl-layout-carousel) {
    padding-bottom: 12px;
  }

  :host(.xs-layout-carousel) {
    padding-bottom: 12px;
  }
`;

const mediumScreen = css`
  :host(.xs-layout-carousel) {
    padding-bottom: 0;
  }

  :host(.md-layout-carousel) {
    padding-bottom: 12px;
  }
`;

const largeScreen = css`
  :host(.md-layout-carousel) {
    padding-bottom: 0;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  ...layoutScreenStyles,
  {
    media: mdScreen,
    css: mediumScreen,
  },
  {
    media: lgScreen,
    css: largeScreen,
  },
];
