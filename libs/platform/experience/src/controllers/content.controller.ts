import { FeatureOptionsService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  getStaticProp,
  InstanceWithStatic,
  ObserveController,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { optionsKey } from '../decorators';
import { ContentComponentProperties } from '../models';
import { ExperienceService } from '../services';

export class ContentController<T = unknown, K = unknown> {
  protected experienceContent = resolve(
    ExperienceService,
    null
  ) as ExperienceService | null;
  protected observe: ObserveController<
    LitElement & ContentComponentProperties<K, T>
  >;
  protected optionsService = resolve(FeatureOptionsService, null);

  constructor(protected host: LitElement & ContentComponentProperties<K, T>) {
    // TODO: fix property assigning outside of constructor, it doesn't work in the storybook now
    this.observe = new ObserveController(host);
  }

  getContent(): Observable<T | undefined> {
    return this.observe.get('content').pipe(
      switchMap((content) => {
        if (content !== undefined) {
          return of(content);
        }
        return this.observe.get('uid').pipe(
          switchMap((uid) =>
            uid && this.experienceContent
              ? this.experienceContent
                  .getContent<{ data: T }>({ uid })
                  .pipe(map((component) => component?.data))
              : of(undefined)
          ),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      })
    );
  }

  getOptions(): Observable<Partial<K>> {
    return this.observe.get('options').pipe(
      switchMap((options) => {
        const defaultOptions = {
          ...getStaticProp(
            this.host as unknown as InstanceWithStatic<K>,
            optionsKey
          ),
          ...this.optionsService?.getFeatureOptions?.(this.host.tagName),
        } as K;

        if (options !== undefined) {
          return of({
            ...defaultOptions,
            ...options,
          });
        }

        return this.observe.get('uid').pipe(
          switchMap((uid) =>
            uid && this.experienceContent
              ? this.experienceContent.getOptions<{ data: K }>({ uid }).pipe(
                  map((component) => {
                    return component?.data
                      ? { ...defaultOptions, ...component?.data }
                      : defaultOptions;
                  })
                )
              : of(defaultOptions)
          ),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      })
    );
  }
}
