import { ThemeColors } from '@spryker-oryx/experience';

export const reverse = (color: string | ThemeColors): ThemeColors | string => {
  if (typeof color === 'string') {
    return color;
  } else
    return {
      100: color[500],
      200: color[400],
      300: color[300],
      400: color[200],
      500: color[100],
    };
};

export const colorPalette = {
  white: {
    100: '#FFFFFF',
    200: '#F5F5F5',
    300: '#E7EAEE',
    400: '#DCE0E5',
    500: '#DBDBDB',
  },
  gray: {
    100: '#B7BEC9',
    200: '#B2B2B2',
    300: '#71747C',
    400: '#4C4C4C',
    500: '#333333',
  },
  green: {
    100: '#F1F8F7',
    200: '#94DDC0',
    300: '#11856E',
    400: '#1C6C5C',
    500: '#004628',
  },
  orange: {
    100: '#FEF0E6',
    200: '#FFAA70',
    300: '#FF6800',
    400: '#B7540F',
    500: '#894618',
  },
  red: {
    100: '#F8E9E6',
    200: '#F19D8F',
    300: '#C72712',
    400: '#A03523',
    500: '#782214',
  },
  yellow: {
    100: '#FFF7E6',
    200: '#FEDC93',
    300: '#FDBE36',
    400: '#E4A41C',
    500: '#D88D00',
  },
  blue: {
    100: '#EAF1FA',
    200: '#A2C6E5',
    300: '#0064B4',
    400: '#005090',
    500: '#034072',
  },
};
