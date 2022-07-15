import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { MOCK_SEMANTIC_LINK_PROVIDERS } from './mock-semantic-link.providers';

export function setupSemanticLinkMocks(): void {
  destroyInjector();
  createInjector({
    providers: [
      ...MOCK_SEMANTIC_LINK_PROVIDERS,
      {
        provide: 'MOCKS',
        useValue: 'semanticLinkMocks',
      },
    ],
  });
}
