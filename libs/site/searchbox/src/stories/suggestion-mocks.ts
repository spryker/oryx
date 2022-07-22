import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { MOCK_SUGGESTION_PROVIDERS } from '../../../src';

export function setupSuggestionMocks(): void {
  destroyInjector();

  createInjector({
    providers: MOCK_SUGGESTION_PROVIDERS,
  });
}
