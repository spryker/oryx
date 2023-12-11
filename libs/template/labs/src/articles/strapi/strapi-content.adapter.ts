import {
  Content,
  ContentAdapter,
  ContentConfig,
  ContentQualifier,
} from '@spryker-oryx/content';
import { HttpService, TransformerService } from '@spryker-oryx/core';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  Observable,
  combineLatest,
  from,
  map,
  of,
  reduce,
  switchMap,
} from 'rxjs';
import { StrapiFieldNormalizer } from './normalizers';
import { StrapiCmsModel } from './strapi.api.model';
import { StrapiApiUrl, StrapiToken } from './strapi.model';

export interface TypeData {
  type: string;
  pluralType: string;
  attributes: Record<string, StrapiCmsModel.TypeAttributes>;
}

export class DefaultStrapiContentAdapter implements ContentAdapter {
  constructor(
    protected token = inject(StrapiToken),
    protected config = inject(ContentConfig),
    protected url = inject(StrapiApiUrl),
    protected http = inject(HttpService),
    protected transformer = inject(TransformerService),
    protected locale = inject(LocaleService),
    protected injector = inject(INJECTOR)
  ) {
    this.defaultType = config.reduce(
      (acc, item) => ({ ...acc, ...item }),
      {}
    ).strapi.defaultType;
  }

  protected defaultType?: string;
  protected isPreview = false;

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
    return combineLatest([this.getType(qualifier), this.locale.get()]).pipe(
      switchMap(([{ type, attributes, pluralType }, _locale]) => {
        const { tags = [], query: _query } = qualifier;
        const query = _query ? `_q=${_query}` : '';
        const preview = this.isPreview ? '&publicationState=preview' : '';
        const locale = `&locale=${_locale}`;

        return combineLatest([
          this.search(`${pluralType}?${query}${locale}${preview}`),
          of({
            type,
            attributes,
            tags: Array.isArray(tags) ? tags : [tags],
          }),
        ] as const);
      }),
      switchMap(
        ([{ data: _data }, { type: contentType, attributes, tags }]) => {
          const data = tags
            ? _data.filter((item) =>
                item.attributes.tags.some((tag) => tags.includes(tag.name))
              )
            : _data;
          return from(data).pipe(
            switchMap((record) =>
              this.parseEntry(record, contentType, attributes)
            ),
            reduce((a, c) => [...a, c], [] as Content[])
          );
        }
      )
    );
  }

  protected parseEntry(
    record: StrapiCmsModel.Entry,
    type: string,
    attributes: Record<string, StrapiCmsModel.TypeAttributes>
  ): Observable<Content> {
    return combineLatest(
      Object.entries<StrapiCmsModel.TypeAttributes>(attributes).map(
        ([key, { type }]) =>
          this.transformer.transform(
            { type, key, value: record.attributes[key] },
            StrapiFieldNormalizer
          )
      )
    ).pipe(
      map((fields) => ({
        id: String(record.id),
        type,
        fields: fields.reduce(
          (acc, { key, value }) => ({
            ...acc,
            [key === 'identifier' ? 'id' : key]: value,
          }),
          {} as Content['fields']
        ),
      }))
    );
  }

  protected getCmsLocales(): Observable<StrapiCmsModel.Locale[]> {
    return this.search('i18n/locales');
  }

  protected getType(qualifier: ContentQualifier): Observable<TypeData> {
    return this.search<StrapiCmsModel.TypesResponse>(
      'content-type-builder/content-types'
    ).pipe(
      map(({ data }) => {
        const getData = (type: string) => {
          const component = data.find((t) => t.schema.singularName === type);

          if (!component) throw new Error('Content type not found');

          return {
            type,
            pluralType: component.schema.pluralName,
            attributes: component.schema.attributes,
          };
        };

        if (qualifier.type || this.defaultType) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return getData(qualifier.type ?? this.defaultType!);
        }

        let component!: StrapiCmsModel.Type;

        const type = qualifier.entities?.find((id) => {
          const record = data.find((t) => t.schema.singularName === id);

          if (!record) return false;

          component = record;

          return true;
        });

        if (!type) throw new Error('Content type not found');

        return {
          type: component.schema.singularName,
          pluralType: component.schema.pluralName,
          attributes: component.schema.attributes,
        };
      })
    );
  }

  protected search<T = StrapiCmsModel.EntriesResponse>(
    endpoint = ''
  ): Observable<T> {
    return this.http.get<T>(`${this.url}/api/${endpoint}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}
