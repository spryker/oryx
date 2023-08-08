import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
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

  getEntries(
    search: StoryblokSearch
  ): Observable<StoryblokEntriesResponse | null> {
    const endpoint = search.query
      ? `?search_term=${search.query}&`
      : `?starts_with=${search.type}&`;
    return this.search<StoryblokEntriesResponse>(`${endpoint}`);
  }

  getEntry(search: StoryblokSearch): Observable<StoryblokEntryResponse | null> {
    const endpoint = `/${search.slug}?`;
    return this.search<StoryblokEntryResponse>(endpoint).pipe(tap(console.log));
  }

  protected search<T>(endpoint: string): Observable<T | null> {
    return this.locale.get().pipe(
      switchMap((locale) =>
        this.http.get<T>(
          `${this.endpoint}${endpoint}token=${this.storyblokToken}&language=${locale}`
        )
      ),
      catchError(() => of(null))
    );
  }
}
