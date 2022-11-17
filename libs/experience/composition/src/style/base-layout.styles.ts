import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { lgScreen, mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const baseLayoutStyles = css`
  @layer layout {
    :host {
      --oryx-layout-height: auto;

      display: flex;
      flex-direction: column;
      gap: var(--oryx-layout-gap);
      align-items: flex-start;
      margin: var(--oryx-layout-margin, 0);
      padding: var(--oryx-layout-padding, 0);
      width: 100%;
    }

    :host,
    :host([class*='-layout-']) > * {
      box-sizing: border-box;
      min-width: 0;
      height: auto;
    }

    :host([class*='-layout-']) > * {
      width: 100%;
      height: var(--oryx-layout-height, 100%);
    }

    :host([class*='-layout-']) > *[class*='has-padding'] {
      padding: var(--oryx-layout-padding, 0);
    }

    :host([class*='-layout-']) > *[class*='has-margin'] {
      margin: var(--oryx-layout-margin, 0);
      width: calc(100% - (var(--oryx-layout-margin, 0px) * 2));
      height: calc(
        var(--oryx-layout-height, 100%) - (var(--oryx-layout-margin, 0px) * 2)
      );
    }
  }
`;

export const layoutMediumScreen = css`
  :host {
    --oryx-layout-item-count: 2;
  }
`;

export const layoutLargeScreen = css`
  :host {
    --oryx-layout-item-count: 4;
  }
`;

export const baseLayoutScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: layoutMediumScreen,
  },
  {
    media: lgScreen,
    css: layoutLargeScreen,
  },
];
