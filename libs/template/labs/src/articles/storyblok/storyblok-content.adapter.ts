import {
  Content,
  ContentAdapter,
  ContentField,
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
import { StoryblokFieldNormalizer } from './normalizers';
import { StoryblokCmsModel } from './storyblok.api.model';
import { StoryblokSpace, StoryblokToken } from './storyblok.model';

export interface StoryblokEntry {
  id: string;
  fields: StoryblokCmsModel.StoryContent;
  type: string;
  name: string;
}

export class DefaultStoryblokContentAdapter implements ContentAdapter {
  constructor(
    protected token = inject(StoryblokToken),
    protected space = inject(StoryblokSpace),
    protected http = inject(HttpService),
    protected transformer = inject(TransformerService),
    protected locale = inject(LocaleService),
    protected injector = inject(INJECTOR)
  ) {}

  protected url = `https://mapi.storyblok.com/v1/spaces/${this.space}`;
  protected readonlyUrl = `https://api.storyblok.com/v2/cdn/stories/`;

  /**
   * @deprecated Since version 1.1. Will be removed.
   */
  getKey(qualifier: ContentQualifier): string {
    return qualifier.id ?? qualifier.query ?? '';
  }

  get(qualifier: ContentQualifier): Observable<Content | null> {
    return combineLatest([
      this.search<StoryblokCmsModel.EntryResponse>(
        qualifier.type
          ? `${qualifier.type}/${qualifier.id}?`
          : `${qualifier.id}?`
      ),
      this.getSpaceData<StoryblokCmsModel.ComponentResponse>(
        `/components/${qualifier.type}`
      ),
    ]).pipe(
      switchMap(([{ story }, { component }]) =>
        this.parseEntry(
          {
            fields: story.content,
            type: story.content.component ?? qualifier.type,
            id: String(story.id),
            name: story.name,
          },
          component.schema
        )
      )
    );
  }

  getAll(qualifier: ContentQualifier): Observable<Content[] | null> {
    let endpoint = '?';

    if (qualifier.query) {
      endpoint += `&search_term=${qualifier.query}`;
    }
    if (qualifier.type) {
      endpoint += `&by_slugs=${qualifier.type}/*`;
    }

    return this.search<StoryblokCmsModel.EntriesResponse>(endpoint).pipe(
      switchMap((stories) => {
        const entities: StoryblokEntry[] = [];
        const types$: Record<string, Observable<StoryblokCmsModel.Schema>> = {};

        for (const entry of stories.stories) {
          entities.push({
            fields: entry.content,
            id: String(entry.id),
            type: entry.content.component,
            name: entry.name,
          });

          types$[entry.content.component] ??=
            this.getSpaceData<StoryblokCmsModel.ComponentResponse>(
              `/components/${entry.content.component}`
            ).pipe(map((data) => data.component.schema));
        }

        return combineLatest([of(entities), forkJoin(types$)]);
      }),
      switchMap(([entities, types]) => {
        return from(entities).pipe(
          switchMap((entry) =>
            this.parseEntry(entry, types[entry.fields.component])
          ),
          reduce((a, c) => [...a, c], [] as Content[])
        );
      })
    );
  }

  protected parseEntry(
    entry: StoryblokEntry,
    types: StoryblokCmsModel.Schema
  ): Observable<Content> {
    return combineLatest([
      this.parseEntryFields(entry.fields, types),
      of(entry),
    ]).pipe(map(([fields, data]) => ({ ...data, fields })));
  }

  protected parseEntryFields(
    content: StoryblokCmsModel.StoryContent,
    types: Record<string, StoryblokCmsModel.Field>
  ): Observable<ContentField> {
    return combineLatest(
      Object.entries(types).map(([key, data]) => {
        const { type } = data;
        const value = content?.[key];
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

  protected search<T>(endpoint: string): Observable<T> {
    return combineLatest([this.locale.get(), this.getSpaceData()]).pipe(
      switchMap(([locale, { space }]) =>
        this.http.get<T>(
          `${this.readonlyUrl}${endpoint}&version=draft&token=${space.first_token}&language=${locale}`
        )
      )
    );
  }

  protected getSpaceData<T = StoryblokCmsModel.SpaceResponse>(
    endpoint = ''
  ): Observable<T> {
    return this.http.get<T>(`${this.url}${endpoint}`, {
      headers: { Authorization: this.token },
    });
  }
}
