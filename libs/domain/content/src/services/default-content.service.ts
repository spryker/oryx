import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { SuggestionField } from '@spryker-oryx/search';
import { combineLatest, map, Observable } from 'rxjs';
import { Content, ContentQualifier } from '../models';
import { ContentAdapter, ContentConfig } from './adapter/content.adapter';
import { ContentService } from './content.service';

export class DefaultContentService implements ContentService {
  protected contents: Record<string, string[]> = {};

  constructor(
    protected adapters = inject(ContentAdapter),
    protected config = inject(ContentConfig)
  ) {
    this.normalizeConfig();
  }

  protected contentQuery = createQuery<Content | null, ContentQualifier>({
    loader: (q: ContentQualifier) =>
      combineLatest(this.getAdapters(q).map((adapter) => adapter.get(q))).pipe(
        map((contents) =>
          contents.reduce(
            (acc, curr) => (curr ? { ...acc, ...curr } : acc),
            null
          )
        )
      ),
    refreshOn: [LocaleChanged],
  });

  protected contentsQuery = createQuery<Content[] | null, ContentQualifier>({
    loader: (q: ContentQualifier) =>
      combineLatest(
        this.getAdapters(q).map((adapter) => adapter.getAll(q))
      ).pipe(
        map((contents) =>
          contents.reduce(
            (acc, curr) => (curr ? [...(acc ?? []), ...curr] : acc),
            null
          )
        )
      ),
    onLoad: [
      ({ data }) => {
        data?.forEach((content) => {
          this.contentQuery.set({
            data: content,
            qualifier: { id: content.id },
          });
        });
      },
    ],
    refreshOn: [LocaleChanged],
  });

  getAll<T>(
    qualifier: ContentQualifier
  ): Observable<Content<T>[] | null | undefined>;
  getAll<T>(
    qualifier: ContentQualifier
  ): Observable<Content<T>[] | null | undefined>;
  getAll(
    qualifier: ContentQualifier
  ): Observable<Content[] | null | undefined> {
    return this.contentsQuery.get({ ...qualifier });
  }

  get<T>(
    qualifier: ContentQualifier
  ): Observable<Content<T> | null | undefined>;
  get<T = Record<string, unknown>>(
    qualifier: ContentQualifier
  ): Observable<Content<T> | null | undefined>;
  get(qualifier: ContentQualifier): Observable<Content | null | undefined> {
    return this.contentQuery.get({ ...qualifier });
  }

  getState(
    qualifier: ContentQualifier
  ): Observable<QueryState<Content | null>> {
    return this.contentQuery.getState({ ...qualifier });
  }

  protected normalizeConfig(): void {
    this.contents = this.config.reduce(
      (config, data) => ({
        ...config,
        ...Object.entries(data).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: config[key] ? [...config[key], ...value.types] : value.types,
          }),
          {}
        ),
      }),
      {} as Record<string, string[]>
    );
  }

  protected getAdapters(qualifier: ContentQualifier): ContentAdapter[] {
    console.log(qualifier.entities);
    if (
      !qualifier.entities ||
      qualifier.entities.includes(SuggestionField.Contents)
    )
      return this.adapters;

    const adapters = this.adapters.filter((adapter) =>
      this.contents[adapter.getName()]?.some((entity) =>
        qualifier.entities?.includes(entity)
      )
    );

    return adapters;
  }
}
