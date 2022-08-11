import { Observable, of } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionService } from '../../services';
import { completion } from './completion.mock';
import { createSuggestionMock } from './mock-suggestion.generator';

export class MockSuggestionService implements Partial<SuggestionService> {
  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return of(createSuggestionMock(qualifier, completion));
  }
}
