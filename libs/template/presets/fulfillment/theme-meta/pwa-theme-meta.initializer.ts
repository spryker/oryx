import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { bodyStyles, fontMeta, iconMeta } from '../../src/meta';

export class PWAThemeMetaInitializer implements AppInitializer {
  constructor(protected metaService = inject(PageMetaService, null)) {}

  initialize(): void {
    this.metaService?.add([
      ...fontMeta(),
      ...bodyStyles({ fontSize: '16px' }),
      ...iconMeta(),
    ]);
  }
}
