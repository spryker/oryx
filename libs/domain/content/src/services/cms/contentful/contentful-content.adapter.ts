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
import { Content, ContentMeta, ContentQualifier } from '../../../models';
import { ContentAdapter } from '../../adapter';
import { ContentfulCmsModel } from './contentful.api.model';
import {
  ContentfulAssets,
  ContentfulSpace,
  ContentfulToken,
} from './contentful.model';
import {
  ContentfulAssetsNormalizer,
  ContentfulContentField,
  ContentfulFieldNormalizer,
} from './normalizers';

export interface ContentfulEntry {
  fields: ContentfulContentField[];
  _meta: ContentMeta;
}

export class DefaultContentfulContentAdapter implements ContentAdapter {
  protected token = inject(ContentfulToken);
  protected space = inject(ContentfulSpace);
  protected http = inject(HttpService);
  protected transformer = inject(TransformerService);
  protected locale = inject(LocaleService);
  protected injector = inject(INJECTOR);
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
        (data) => data?.find((content) => content.id === qualifier.id) ?? null
      )
    );
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    return combineLatest([this.getEntries(qualifier), this.getAssets()]).pipe(
      switchMap(([records]) => {
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
            _meta: record._meta,
            ...fields.reduce(
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
        combineLatest([
          this.http.get<ContentfulCmsModel.EntriesResponse>(
            `${this.url}/entries?${this.getParams({ ...qualifier, locale })}`,
            { headers: { Authorization: `Bearer ${this.token}` } }
          ),
          this.getAssets(),
        ]).pipe(
          switchMap(([{ items }, assets]) => {
            const types$: Record<
              string,
              Observable<Record<string, ContentfulCmsModel.Type>>
            > = {};

            for (const entry of items) {
              const type = entry.sys.contentType.sys.id;
              types$[type] ??= this.getContentFields(type);
            }

            return combineLatest([of(items), forkJoin(types$), of(assets)]);
          }),
          map(([items, types, assets]) => {
            return items.map((record) =>
              this.parseEntry(
                record,
                types[record.sys.contentType.sys.id],
                locale,
                qualifier,
                assets
              )
            );
          })
        )
      )
    );
  }

  protected parseEntry(
    record: ContentfulCmsModel.SimpleResponse<ContentfulCmsModel.Entry>,
    types: Record<string, ContentfulCmsModel.Type>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    locale: string,
    qualifier: ContentQualifier,
    assets: Record<string, ContentfulAssets>
  ): ContentfulEntry {
    return {
      fields: this.parseEntryFields(record.fields, types, locale, assets),
      _meta: {
        id: record.sys.id,
        type: qualifier.type ?? record.sys.contentType.sys.id,
        name: record.fields.id,
      },
    };
  }

  protected parseEntryFields(
    fields: ContentfulCmsModel.Entry,
    types: Record<string, ContentfulCmsModel.Type>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    locale: string,
    assets: Record<string, ContentfulAssets>
  ): ContentfulContentField[] {
    return Object.entries(fields).map(([key, value]) => ({
      key,
      value,
      type: types[key]?.type ?? '',
      assets,
    }));
  }

  protected getParams(qualifier: Record<string, unknown>): string {
    return Object.entries(qualifier).reduce((acc, [key, _value]) => {
      if (key === 'id' || key === 'entities') return acc;

      const mapper = {
        [key]: key,
        tags: 'metadata.tags.sys.id[in]',
        type: 'content_type',
      };
      const value = Array.isArray(_value) ? _value.join(',') : _value;
      const param = `${mapper[key as keyof typeof mapper]}=${value}`;

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

  protected getAssets(): Observable<Record<string, ContentfulAssets>> {
    return this.http
      .get<ContentfulCmsModel.Asset>(`${this.url}/assets`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(this.transformer.do(ContentfulAssetsNormalizer));
  }

  protected getCmsLocales(): Observable<ContentfulCmsModel.Locale[]> {
    return this.http
      .get<ContentfulCmsModel.LocalesResponse>(`${this.url}/locales`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(map((data) => data.items));
  }
}
