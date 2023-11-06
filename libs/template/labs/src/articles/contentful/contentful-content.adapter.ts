import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { HttpService, TransformerService } from '@spryker-oryx/core';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  Observable,
  combineLatest,
  forkJoin,
  from,
  map,
  of,
  reduce,
  switchMap,
} from 'rxjs';
import { ContentfulCmsModel } from './contentful.api.model';
import { ContentfulSpace, ContentfulToken } from './contentful.model';
import {
  ContentfulContentField,
  ContentfulFieldNormalizer,
} from './normalizers';

export interface ContentfulEntry {
  id: string;
  fields: ContentfulContentField[];
  type: string;
  name: string;
}

export class DefaultContentfulContentAdapter implements ContentAdapter {
  constructor(
    protected token = inject(ContentfulToken),
    protected space = inject(ContentfulSpace),
    protected http = inject(HttpService),
    protected transformer = inject(TransformerService),
    protected locale = inject(LocaleService),
    protected injector = inject(INJECTOR)
  ) {}

  protected url = `https://cdn.contentful.com/spaces/${this.space}`;

  /**
   * @deprecated Since version 1.1. Will be removed.
   */
  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? qualifier.query ?? '';
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    return this.getAll(qualifier).pipe(
      map(
        (data) =>
          data?.find((content) => content.fields.id === qualifier.id) ?? null
      )
    );
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    return this.getEntries(qualifier).pipe(
      switchMap((records) => {
        return from(records).pipe(
          switchMap((record) => this.parseEntryItem(record)),
          reduce((a, c) => [...a, c], [] as Content[])
        );
      })
    );
  }

  protected parseEntryItem(record: ContentfulEntry): Observable<Content> {
    return combineLatest(
      record.fields.map((field) =>
        this.transformer.transform(field, ContentfulFieldNormalizer)
      )
    ).pipe(
      map(
        (fields) =>
          ({
            ...record,
            fields: fields.reduce(
              (acc, { key, value }) => ({ ...acc, [key]: value }),
              {}
            ),
          } as Content)
      )
    );
  }

  protected getEntries(
    qualifier: ContentQualifier
  ): Observable<ContentfulEntry[]> {
    return this.getLocalLocale().pipe(
      switchMap((locale) =>
        this.http
          .get<ContentfulCmsModel.EntriesResponse>(
            `${this.url}/entries?${this.getParams({ ...qualifier, locale })}`,
            { headers: { Authorization: `Bearer ${this.token}` } }
          )
          .pipe(
            switchMap(({ items }) => {
              const types$: Record<
                string,
                Observable<Record<string, ContentfulCmsModel.Type>>
              > = {};

              for (const entry of items) {
                const type = entry.sys.contentType.sys.id;
                types$[type] ??= this.getContentFields(type);
              }

              return combineLatest([of(items), forkJoin(types$)]);
            }),
            map(([items, types]) =>
              items.map((record) =>
                this.parseEntry(
                  record,
                  types[record.sys.contentType.sys.id],
                  locale,
                  qualifier
                )
              )
            )
          )
      )
    );
  }

  protected parseEntry(
    record: ContentfulCmsModel.SimpleResponse<ContentfulCmsModel.Entry>,
    types: Record<string, ContentfulCmsModel.Type>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    locale: string,
    qualifier: ContentQualifier
  ): ContentfulEntry {
    return {
      fields: this.parseEntryFields(record.fields, types, locale),
      id: record.sys.id,
      type: qualifier.type ?? record.sys.contentType.sys.id,
      name: record.fields.id,
    };
  }

  protected parseEntryFields(
    fields: ContentfulCmsModel.Entry,
    types: Record<string, ContentfulCmsModel.Type>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    locale: string
  ): ContentfulContentField[] {
    return Object.entries(fields).map(([key, value]) => ({
      key,
      value,
      type: types[key]?.type ?? '',
    }));
  }

  protected getParams(qualifier: Record<string, unknown>): string {
    return Object.entries(qualifier).reduce((acc, [key, value]) => {
      if (key === 'id' || key === 'entities') {
        return acc;
      }

      const param = `${key === 'type' ? 'content_type' : key}=${value}`;

      if (!acc.length) {
        return param;
      }

      return `${acc}&${param}`;
    }, '');
  }

  protected getLocalLocale(): Observable<string> {
    return combineLatest([this.locale.get(), this.locale.getAll()]).pipe(
      map(
        ([code, all]) =>
          all
            .find((_locale) => _locale.code === code)
            ?.name.replace('_', '-') ?? ''
      )
    );
  }

  protected getContentFields(
    type: string
  ): Observable<Record<string, ContentfulCmsModel.Type>> {
    return this.http
      .get<ContentfulCmsModel.TypesResponse>(
        `${this.url}/content_types?name=${type}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .pipe(
        map((data) =>
          data.items[0]?.fields.reduce(
            (acc, field) => ({ ...acc, [field.id]: field }),
            {}
          )
        )
      );
  }

  protected getCmsLocales(): Observable<ContentfulCmsModel.Locale[]> {
    return this.http
      .get<ContentfulCmsModel.LocalesResponse>(`${this.url}/locales`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(map((data) => data.items));
  }
}
