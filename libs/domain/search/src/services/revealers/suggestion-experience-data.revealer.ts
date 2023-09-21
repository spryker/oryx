import { inject } from '@spryker-oryx/di';
import {
  catchMessage,
  ExperienceDataRevealer,
  ExperienceSuggestionRecords,
  MessageType,
  postMessage,
} from '@spryker-oryx/experience';
import { RouteType } from '@spryker-oryx/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Suggestion } from '../../models';
import { SuggestionService } from '../suggestion';

export class SuggestionExperienceDataRevealer
  implements ExperienceDataRevealer
{
  constructor(protected suggestionService = inject(SuggestionService, null)) {}

  protected suggestions$ = catchMessage(MessageType.SuggestionQuery).pipe(
    switchMap((data) => this.suggestionService?.get(data) ?? of(undefined)),
    tap((suggestions?: Suggestion) => {
      if (suggestions) {
        suggestions.products = suggestions?.products?.map((product) => ({
          ...product,
          type: RouteType.Product,
        }));
      }

      return postMessage({
        type: MessageType.Suggestions,
        data: suggestions as ExperienceSuggestionRecords,
      });
    })
  );

  reveal(): Observable<unknown> {
    return this.suggestions$;
  }
}
