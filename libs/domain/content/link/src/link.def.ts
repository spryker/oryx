import { componentDef } from '@spryker-oryx/core';
import { ContentLinkOptions } from './link.model';

declare global {
  interface FeatureOptions {
    'oryx-content-link'?: ContentLinkOptions;
  }
}

export const contentLinkComponent = componentDef({
  name: 'oryx-content-link',
  impl: () => import('./link.component').then((m) => m.ContentLinkComponent),
  schema: () => import('./link.schema').then((m) => m.linkComponentSchema),
});
