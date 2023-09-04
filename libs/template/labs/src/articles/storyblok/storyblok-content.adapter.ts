import {
  Content,
  ContentAdapter,
  ContentField,
  ContentQualifier,
} from '@spryker-oryx/content';
import { HttpService, TransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { StoryblokFieldNormalizer } from './normalizers';
import { StoryblokCmsModel } from './storyblok.api.model';
import { StoryblokSpace, StoryblokToken } from './storyblok.model';

export class DefaultStoryblokContentAdapter implements ContentAdapter {
  constructor(
    protected token = inject(StoryblokToken),
    protected space = inject(StoryblokSpace),
    protected http = inject(HttpService),
    protected transformer = inject(TransformerService),
    protected locale = inject(LocaleService)
  ) {}

  protected url = `https://mapi.storyblok.com/v1/spaces/${this.space}`;

  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? qualifier.query ?? '';
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    return this.getData<StoryblokCmsModel.EntriesResponse>(
      `/stories?with_slug=${qualifier.type}/${qualifier.id}`
    ).pipe(
      switchMap((data) => {
        if (!data?.stories.length) return of(null);

        return combineLatest([
          this.getData<StoryblokCmsModel.EntryResponse>(
            `/stories/${data.stories[0].id}`
          ),
          this.getData<StoryblokCmsModel.ComponentResponse>(
            `/components/${data.stories[0].content_type}`
          ),
          this.locale.get(),
          this.getData(),
        ]).pipe(
          switchMap(([data, component, locale, spaces]) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { content, id } = data!.story;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { space } = spaces!;
            const version = 1;
            const types = component?.component.schema ?? {};

            return combineLatest([
              this.parseEntryFields(content, space, types, locale),
              of({
                version,
                type: qualifier.type ?? '',
                id: String(id),
              }),
            ]);
          }),
          map(([fields, data]) => ({ ...data, fields }))
        );
      })
    );
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    const endpoint = qualifier.query
      ? `?text_search=${qualifier.query}`
      : `?starts_with=${qualifier.type}`;
    return this.getData<StoryblokCmsModel.EntriesResponse>(
      `/stories${endpoint}`
    ).pipe(
      map(
        (entries) =>
          entries?.stories.map((entry) => ({
            id: String(entry.id),
            version: 1,
            type: qualifier.type ?? entry.full_slug.split('/')[0] ?? '',
            fields: { id: entry.slug, heading: entry.name },
          })) ?? null
      )
    );
  }

  protected parseEntryFields(
    content: StoryblokCmsModel.StoryContent,
    space: StoryblokCmsModel.Space,
    types: Record<string, StoryblokCmsModel.Field>,
    locale: string
  ): Observable<ContentField> {
    const shouldLocalize = space.languages.find((lang) => lang.code === locale);

    return combineLatest(
      Object.entries(types).map(([key, data]) => {
        const { translatable, type } = data;
        const translatableKey =
          translatable && shouldLocalize ? `${key}__i18n__${locale}` : key;
        const value = translatable
          ? content?.[translatableKey]
          : content?.[key];
        const field = { key, value, type };

        return this.transformer.transform(field, StoryblokFieldNormalizer);
      })
    ).pipe(
      map((fields) =>
        fields.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {} as ContentField
        )
      )
    );
  }

  protected getData<T = StoryblokCmsModel.SpaceResponse>(
    endpoint = ''
  ): Observable<T | null> {
    return this.http.get<T>(`${this.url}${endpoint}`, {
      headers: { Authorization: this.token },
    });
  }
}
