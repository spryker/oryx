import {
  Suggestion,
  SuggestionAdapter,
  SuggestionQualifier,
} from '@spryker-oryx/search';
import { Observable, of } from 'rxjs';
import { completion } from './mock-completion';
import { createSuggestionMock } from './mock-suggestion.generator';

export class MockSuggestionAdapter implements SuggestionAdapter {
  getKey(qualifier: SuggestionQualifier): string {
    return '';
  }
  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return of(createSuggestionMock(qualifier, completion));
  }
}
