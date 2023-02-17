import { Observable, of } from 'rxjs';
import { completion } from './completion.mock';
import { createSuggestionMock } from './mock-suggestion.generator';
import { SuggestionService } from '../../../services';
import { Suggestion, SuggestionQualifier } from '../../../models';

export class MockSuggestionService implements Partial<SuggestionService> {
  get(qualifier: SuggestionQualifier): Observable<Suggestion> {
    return of(createSuggestionMock(qualifier, completion));
  }
}
