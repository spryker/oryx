import {
  Content,
  ContentAdapter,
  ContentQualifier,
} from '@spryker-oryx/content';
import { HttpService, TransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, combineLatest, from, map, reduce, switchMap } from 'rxjs';
import { ContentfulCmsModel } from './contentful.api.model';
import { ContentfulSpace, ContentfulToken } from './contentful.model';
import { ContentfulFieldNormalizer } from './normalizers';

export const cmsContentfulName = 'oryx.cms.contentful';

export class ContentfulCmsAdapter implements ContentAdapter {
  constructor(
    protected token = inject(ContentfulToken),
    protected space = inject(ContentfulSpace),
    protected http = inject(HttpService),
    protected transformer = inject(TransformerService),
    protected locale = inject(LocaleService)
  ) {}

  protected url = `https://api.contentful.com/spaces/${this.space}`;

  getName(): string {
    return cmsContentfulName;
  }

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
    return combineLatest([
      this.http.get<ContentfulCmsModel.CrudEntriesResponse>(
        `${this.url}/entries?${this.getParams(qualifier)}`,
        { headers: { Authorization: `Bearer ${this.token}` } }
      ),
      this.getContentFields(qualifier.type ?? ''),
      this.getLocalLocale(),
    ]).pipe(
      switchMap(([data, types, locale]) => {
        const records = data.items.map((record) => {
          const fields = Object.entries(record.fields).map(([key, field]) => {
            const { localized, type } = types[key] ?? {};
            const value = localized ? field[locale] : Object.values(field)[0];

            return { key, value, type };
          });

          return {
            fields,
            version: record.sys.version,
            id: record.sys.id,
          };
        });

        return from(records).pipe(
          switchMap((record) => {
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
          }),
          reduce((a, c) => [...a, c], [] as Content[])
        );
      })
    );
  }

  protected getParams(qualifier: ContentQualifier): string {
    return Object.entries(qualifier).reduce((acc, [key, value]) => {
      if (key === ('id' || 'entries')) return acc;

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
          data.items[0].fields.reduce(
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
