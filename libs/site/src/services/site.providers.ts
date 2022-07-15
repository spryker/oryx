import { DefaultSemanticLinkService, SemanticLinkService } from './index';

export const SITE_PROVIDERS = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
];
