import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { Suggestion, SuggestionQualifier } from '../../models';
import { SuggestionAdapter } from './suggestion.adapter';

interface JSON_API_MODEL<T> {
  data: [
    {
      attributes: T;
    }
  ];
}

type GlueSuggestion = JSON_API_MODEL<Suggestion>;

export class DefaultServiceAdapter implements SuggestionAdapter {
  protected productEndpoint = 'catalog-search-suggestions';

  constructor(
    protected http = inject(HttpService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL')
  ) {}

  normalize(product: GlueSuggestion): Suggestion {
    return { ...product.data[0].attributes };
  }

  getKey({ query }: SuggestionQualifier): string {
    return query ?? '';
  }

  get({ query }: SuggestionQualifier): Observable<Suggestion> {
    return this.http
      .get<GlueSuggestion>(
        `${this.SCOS_BASE_URL}/${this.productEndpoint}?q=${query}`
      )
      .pipe(map((res) => this.normalize(res)));
  }
}
