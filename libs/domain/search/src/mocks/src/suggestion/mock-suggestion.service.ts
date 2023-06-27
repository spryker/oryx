import {
  Suggestion,
  SuggestionQualifier,
  SuggestionService,
} from '@spryker-oryx/search';
import { Observable, of } from 'rxjs';
import { completion } from './completion.mock';
import { createSuggestionMock } from './mock-suggestion.generator';

export class MockSuggestionService implements Partial<SuggestionService> {
  get<T = Suggestion>(qualifier: SuggestionQualifier): Observable<T> {
    return of(createSuggestionMock(qualifier, completion)) as Observable<T>;
  }
}
