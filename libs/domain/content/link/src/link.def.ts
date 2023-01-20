import { componentDef } from '@spryker-oryx/core';
import { ContentLinkOptions } from './link.model';

declare global {
  interface FeatureOptions {
    'content-link'?: ContentLinkOptions;
  }
}

export const contentLinkComponent = componentDef({
  name: 'content-link',
  impl: () => import('./link.component').then((m) => m.ContentLinkComponent),
});
