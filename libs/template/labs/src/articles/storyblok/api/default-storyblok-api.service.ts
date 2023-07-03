import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { combineLatest, Observable, switchMap } from 'rxjs';
import {
  StoryblokApiService,
  StoryblokResponse,
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

  getEntries(search: StoryblokSearch): Observable<StoryblokResponse> {
    throw new Error('Method not implemented.');
  }

  getEntry(search: StoryblokSearch): Observable<StoryblokResponse> {
    return combineLatest([this.locale.get(), this.locale.getAll()]).pipe(
      switchMap(([locale, all]) => {
        const name = all
          .find((_locale) => _locale.code === locale)
          ?.name.replace('_', '-');

        return this.http.get<StoryblokResponse>(
          `${this.endpoint}/${search.slug}?token=${this.storyblokToken}`
        );
      })
    );
  }
}
