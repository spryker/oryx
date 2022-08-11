import { HttpErrorResponse } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { NullableGeneric } from '@spryker-oryx/typescript-utils';
import { Observable, ReplaySubject } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from '../adapter';
import { SuggestionService } from './suggestion.service';

export interface SuggestionData {
  value: ReplaySubject<NullableGeneric<Suggestion>>;
  error: ReplaySubject<NullableGeneric<HttpErrorResponse>>;
}

export class DefaultSuggestionService implements SuggestionService {
  protected suggestions = new Map<string, SuggestionData>();

  constructor(protected adapter = inject(SuggestionAdapter)) {}

  get(qualifier: SuggestionQualifier): Observable<NullableGeneric<Suggestion>> {
    return this.getData(qualifier).value;
  }

  getError(
    qualifier: SuggestionQualifier
  ): Observable<NullableGeneric<HttpErrorResponse>> {
    return this.getData(qualifier).error;
  }

  protected getData(qualifier: SuggestionQualifier): SuggestionData {
    const key = this.adapter.getKey(qualifier);

    if (!this.suggestions.has(key)) {
      this.suggestions.set(key, {
        value: new ReplaySubject<NullableGeneric<Suggestion>>(1),
        error: new ReplaySubject<NullableGeneric<HttpErrorResponse>>(1),
      });
      this.reload(qualifier, key);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.suggestions.get(key)!;
  }

  protected reload(qualifier: SuggestionQualifier, key?: string): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = this.suggestions.get(key!)!;

    this.adapter.get(qualifier).subscribe({
      next: (product) => {
        data.value.next(product);
        data.error.next(null);
      },
      error: (error: HttpErrorResponse) => {
        data.error.next(error);
        data.value.next(null);
      },
    });
  }
}
