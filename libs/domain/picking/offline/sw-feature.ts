import { BapiAuthFeature } from '@spryker-oryx/auth';
import { AppFeature } from '@spryker-oryx/core';
import { OfflinePickingFeature } from './feature';

export class SwOfflinePickingFeature
  extends OfflinePickingFeature
  implements AppFeature
{
  override plugins = [];
}

export class SwAuthFeature extends BapiAuthFeature {
  override plugins = [];
}
