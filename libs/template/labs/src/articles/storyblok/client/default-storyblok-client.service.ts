import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, switchMap } from 'rxjs';
import {
  StoryblokClientService,
  StoryblokEntriesResponse,
  StoryblokEntryResponse,
  StoryblokSearch,
  StoryblokToken,
} from './storyblok-client.service';

export class DefaultStoryblokClientService implements StoryblokClientService {
  protected endpoint = `https://api.storyblok.com/v2/cdn/stories/`;

  constructor(
    protected storyblokToken = inject(StoryblokToken),
    protected locale = inject(LocaleService),
    protected http = inject(HttpService)
  ) {}

  getEntries(search: StoryblokSearch): Observable<StoryblokEntriesResponse> {
    const endpoint = `${this.endpoint}?search_term=${search.query}&token=${this.storyblokToken}`;
    return this.search<StoryblokEntriesResponse>(endpoint);
  }

  getEntry(search: StoryblokSearch): Observable<StoryblokEntryResponse> {
    const endpoint = `${this.endpoint}/${search.slug}?token=${this.storyblokToken}`;
    return this.search<StoryblokEntryResponse>(endpoint);
  }

  protected search<T>(endpoint: string): Observable<T> {
    return this.locale
      .get()
      .pipe(
        switchMap((locale) =>
          this.http.get<T>(`${endpoint}&language=${locale}`)
        )
      );
  }
}
