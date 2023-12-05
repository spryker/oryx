import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { bodyStyles, fontMeta, iconMeta } from '../src/meta';

export class StorefrontMetaInitializer implements AppInitializer {
  constructor(protected metaService = inject(PageMetaService, null)) {}

  initialize(): void {
    this.metaService?.add([...fontMeta(), ...bodyStyles(), ...iconMeta()]);
  }
}
