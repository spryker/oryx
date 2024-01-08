import { componentDef } from '@spryker-oryx/utilities';

export const productJsonLdComponent = componentDef({
  name: 'oryx-product-base-schema',
  impl: () =>
    import('./json-ld.component').then((m) => m.ProductJsonLdComponent),
});
