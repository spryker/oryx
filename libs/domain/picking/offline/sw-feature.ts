import { AppFeature } from '@spryker-oryx/core';
import { OfflinePickingFeature } from './feature';

export class SwOfflinePickingFeature
  extends OfflinePickingFeature
  implements AppFeature
{
  override plugins = [];
}
