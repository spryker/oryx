import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { DefaultFontService, FontService } from './services';
export * from './components';

export const contentComponents = Object.values(components);

export const contentFeature: AppFeature = {
  components: contentComponents,
  providers: [{ provide: FontService, useClass: DefaultFontService }],
};
