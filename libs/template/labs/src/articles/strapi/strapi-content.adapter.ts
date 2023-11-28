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
  protected defaultType?: string;
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
      switchMap(([{ type, attributes, pluralType }, locale]) => {
        const query = qualifier.query ? `_q=${qualifier.query}` : '';

        return combineLatest([
          this.search(`${pluralType}?${query}&locale=${locale}`),
          of({ type, attributes }),
        ] as const);
      }),
      switchMap(([{ data }, { type: contentType, attributes }]) => {
        return from(data).pipe(
          switchMap((record) =>
            combineLatest(
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
                type: contentType,
                fields: fields.reduce(
                  (acc, { key, value }) => ({
                    ...acc,
                    [key === 'identifier' ? 'id' : key]: value,
                  }),
                  {} as Content['fields']
                ),
              }))
            )
          ),
          reduce((a, c) => [...a, c], [] as Content[])
        );
      })
    );
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
