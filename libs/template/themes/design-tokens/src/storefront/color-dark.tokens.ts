import { ColorDesignTokens } from '@spryker-oryx/experience';
import { colorPalette, reverse } from '../color-palette';
import { color } from './color.tokens';

export const darkColor: ColorDesignTokens = {
  ink: '#fff',

  canvas: {
    100: '#000000',
    200: '#0a0a0a',
    300: '#181511',
    400: '#231f1a',
    500: '#242424',
  },
  neutral: reverse(color.neutral),

  primary: reverse(color.primary),

  highlight: reverse(color.highlight),

  success: reverse(color.success),
  warning: reverse(color.warning),
  error: reverse(color.error),
  info: reverse(color.info),

  focus: reverse(color.focus),
  placeholder: colorPalette.gray[200],
};
