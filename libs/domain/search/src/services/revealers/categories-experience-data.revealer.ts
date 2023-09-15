import { inject } from '@spryker-oryx/di';
import {
  ExperienceDataRevealer,
  MessageType,
  catchMessage,
  postMessage,
} from '@spryker-oryx/experience';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Suggestion } from '../../models';
import { SuggestionField } from '../adapter';
import { SuggestionService } from '../suggestion';

export class CategoriesExperienceDataRevealer
  implements ExperienceDataRevealer
{
  constructor(protected suggestionService = inject(SuggestionService, null)) {}

  protected categories$ = catchMessage(MessageType.Category).pipe(
    switchMap(
      (query) =>
        this.suggestionService?.get({
          query,
          entities: [SuggestionField.Categories],
        }) ?? of(undefined)
    ),
    tap((suggestions?: Suggestion) => {
      postMessage({
        type: MessageType.Categories,
        data: (suggestions?.categories ?? []).map(({ name, id }) => ({
          name,
          id,
        })),
      });
    })
  );

  reveal(): Observable<unknown> {
    return this.categories$;
  }
}
