import {
  DefaultSemanticLinkService,
  SemanticLinkService,
} from '../../services';

export const MOCK_SEMANTIC_LINK_PROVIDERS = [
  {
    provide: SemanticLinkService,
    useClass: DefaultSemanticLinkService,
  },
];
