import { Size } from '@spryker-oryx/ui';
import { Icons } from '@spryker-oryx/ui/icon';

export interface SpinnerProperties {
  icon?: Icons | string;
  rotation?: SpinnerRotation;
  size?: Size;
}

export enum SpinnerRotation {
  ClockWise = 'clockwise',
  AntiClockWise = 'anticlockwise',
}
