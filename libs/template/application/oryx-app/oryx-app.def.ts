import { componentDef } from '@spryker-oryx/utilities';
import { OryxAppOptions } from './oryx-app.model';

declare global {
  interface FeatureOptions {
    'oryx-app'?: OryxAppOptions;
  }
}

export const oryxAppComponent = componentDef({
  name: 'oryx-app',
  impl: () => import('./oryx-app.component').then((m) => m.OryxAppComponent),
});
