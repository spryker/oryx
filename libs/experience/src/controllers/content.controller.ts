import { ExperienceService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { ObserveController } from '@spryker-oryx/lit-rxjs';
import { LitElement } from 'lit';
import { map, Observable, of, switchMap } from 'rxjs';
import { ContentComponentProperties } from '..';

export class ContentController<T = unknown, K = unknown> {
  protected experienceContent = resolve(
    ExperienceService,
    null
  ) as ExperienceService | null;
  protected observe: ObserveController<
    LitElement & ContentComponentProperties<T, K>
  >;

  constructor(protected host: LitElement & ContentComponentProperties<T, K>) {
    // TODO: fix property assigning outside of constructor, it doesn't work in the storybook now
    this.observe = new ObserveController(host);
  }

  getContent(): Observable<T | undefined> {
    return this.observe.get('content').pipe(
      switchMap((content) => {
        if (content !== undefined) {
          return of(content);
        }
        return this.observe
          .get('uid')
          .pipe(
            switchMap((key) =>
              key && this.experienceContent
                ? this.experienceContent
                    .getContent<{ data: T }>({ key })
                    .pipe(map((component) => component?.data))
                : of(undefined)
            )
          );
      })
    );
  }

  getOptions(): Observable<Partial<K>> {
    return this.observe.get('options').pipe(
      switchMap((options) => {
        if (options !== undefined) {
          return of(options);
        }
        return this.observe
          .get('uid')
          .pipe(
            switchMap((key) =>
              key && this.experienceContent
                ? this.experienceContent
                    .getOptions<{ data: K }>({ key })
                    .pipe(map((component) => component?.data ?? {}))
                : of({})
            )
          );
      })
    );
  }
}
