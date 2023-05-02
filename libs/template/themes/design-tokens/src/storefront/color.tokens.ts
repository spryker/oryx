import {
  ColorDesignTokens,
  colorPalette as newColorPalette,
} from '@spryker-oryx/experience';
import { colorPalette } from '../color-palette';

export const color: ColorDesignTokens = {
  // TODO: decide which color
  ink: '#121212',

  canvas: colorPalette.white,
  // TODO: decide which color
  // canvasA: newColorPalette.gray,

  neutral: colorPalette.gray,
  neutralA: newColorPalette.gray,

  primary: colorPalette.green,
  primaryA: newColorPalette.green,

  secondary: colorPalette.yellow,
  secondaryA: newColorPalette.yellow,

  highlight: colorPalette.red,
  highlightA: newColorPalette.red,

  success: colorPalette.green,
  successA: newColorPalette.green,
  warning: colorPalette.yellow,
  warningA: newColorPalette.yellow,
  error: colorPalette.red,
  errorA: newColorPalette.red,
  info: colorPalette.blue,
  infoA: newColorPalette.blue,

  // TODO: decide which color
  focus: colorPalette.green[300],
  placeholder: colorPalette.gray[300],
};
