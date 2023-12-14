import { featureVersion } from '@spryker-oryx/utilities';

export const OBJECT_FIT =
  featureVersion > '1.4' ? '--object-fit' : '--image-fit';
export const OBJECT_POSITION =
  featureVersion > '1.4' ? '--object-position' : '--image-position';
