import {
  DefaultSemanticLinkService,
  SemanticLinkService,
} from '@spryker-oryx/site';

export const SITE_PROVIDERS = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
];
