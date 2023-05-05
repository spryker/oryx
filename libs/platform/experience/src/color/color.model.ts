import { ColorId } from '@spryker-oryx/utilities';

export type Color = {
  [mode in ColorId]?: {
    0?: string;
    1?: string;
    2?: string;
    3?: string;
    4?: string;
    5?: string;
    6?: string;
    7?: string;
    8?: string;
    9?: string;
    10?: string;
    11?: string;
    12?: string;
  };
};

export type ColorPalette = Record<string, Color>;
