import { ColorMode } from '@spryker-oryx/utilities';

export interface OryxAppOptions {
  /**
   * Color mode of the application, forces the color mode to be light or dark
   * rather than using the user's system preferences.
   */
  colorMode: ColorMode.Dark | ColorMode.Light;
}
