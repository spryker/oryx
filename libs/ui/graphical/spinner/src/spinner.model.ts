import { Icons } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/ui/utilities';

export interface SpinnerProperties {
  icon?: Icons | string;
  rotation?: SpinnerRotation;
  size?: Size;
}

export enum SpinnerRotation {
  ClockWise = 'clockwise',
  AntiClockWise = 'anticlockwise',
}
