import { baseLayoutStyles } from './base-layout.styles';
import { containerLayoutStyles } from './container-layout.styles';
import { largeLayoutStyles } from './large.styles';
import { mediumLayoutStyles } from './medium.styles';
import { smallLayoutStyles } from './small.styles';

/**
 * the ordering of styles is very important for their correct cascading
 * need to keep the order to prevent wrong priorities of styles,
 * especially for different sizes of the screens
 */
export const layoutStyles = [
  baseLayoutStyles,
  containerLayoutStyles,
  smallLayoutStyles,
  mediumLayoutStyles,
  largeLayoutStyles,
];
