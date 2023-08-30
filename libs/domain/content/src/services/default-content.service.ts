import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
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
    this.contents = config.reduce(
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

  protected getQuery = createQuery<Content | null, ContentQualifier>({
    loader: (q: ContentQualifier) =>
      combineLatest(
        this.getAdapters(q).map(
          (adapter) => adapter.get(q) as Observable<Content | null>
        )
      ).pipe(
        map((contents) =>
          contents.reduce(
            (acc, curr) => ({ ...(acc as Content), ...(curr as Content) }),
            {} as Content
          )
        )
      ),
    refreshOn: [LocaleChanged],
  });

  protected getAllQuery = createQuery<Content[] | null, ContentQualifier>({
    loader: (q: ContentQualifier) =>
      combineLatest(
        this.getAdapters(q).map((adapter) => adapter.getAll(q))
      ).pipe(
        map((contents) =>
          contents.reduce(
            (acc, curr) => [...(acc ?? []), ...(curr ?? [])],
            [] as Content[]
          )
        )
      ),
    onLoad: [
      ({ data }) => {
        data?.forEach((content) => {
          this.getQuery.set({
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
  ): Observable<Content<T>[] | null | undefined> {
    return this.getAllQuery.get(qualifier) as Observable<
      Content<T>[] | null | undefined
    >;
  }

  get<T>(
    qualifier: ContentQualifier
  ): Observable<Content<T> | null | undefined> {
    return this.getQuery.get(qualifier) as Observable<
      Content<T> | null | undefined
    >;
  }

  getState(
    qualifier: ContentQualifier
  ): Observable<QueryState<Content | null>> {
    return this.getQuery.getState(qualifier);
  }

  protected getAdapters(qualifier: ContentQualifier): ContentAdapter[] {
    if (!qualifier.entities) return this.adapters;

    const adapters = this.adapters.filter((adapter) =>
      this.contents[adapter.getName()]?.some((entity) =>
        qualifier.entities?.includes(entity)
      )
    );

    delete qualifier.entities;

    return adapters;
  }
}
