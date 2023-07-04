import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, switchMap } from 'rxjs';
import {
  StoryblokApiService,
  StoryblokEntriesResponse,
  StoryblokEntryResponse,
  StoryblokSearch,
  StoryblokToken,
} from './storyblok-api.service';

export class DefaultStoryblokApiService implements StoryblokApiService {
  protected endpoint = `https://api.storyblok.com/v2/cdn/stories/`;

  constructor(
    protected storyblokToken = inject(StoryblokToken),
    protected locale = inject(LocaleService),
    protected http = inject(HttpService)
  ) {}

  getEntries(search: StoryblokSearch): Observable<StoryblokEntriesResponse> {
    return this.locale
      .get()
      .pipe(
        switchMap((locale) =>
          this.http.get<StoryblokEntriesResponse>(
            `${this.endpoint}?search_term=${search.query}&token=${this.storyblokToken}&language=${locale}`
          )
        )
      );
  }

  getEntry(search: StoryblokSearch): Observable<StoryblokEntryResponse> {
    return this.locale
      .get()
      .pipe(
        switchMap((locale) =>
          this.http.get<StoryblokEntryResponse>(
            `${this.endpoint}/${search.slug}?token=${this.storyblokToken}&language=${locale}`
          )
        )
      );
  }
}
