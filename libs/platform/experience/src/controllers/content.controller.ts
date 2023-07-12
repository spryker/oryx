import { FeatureOptionsService, TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  getStaticProp,
  InstanceWithStatic,
  isDefined,
  ObserveController,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import {
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { optionsKey } from '../decorators';
import { ContentComponentProperties } from '../models';
import {
  ComponentVisibility,
  ExperienceService,
  DynamicVisibilityStates,
} from '../services';

export class ContentController<T = unknown, K = unknown> {
  protected experienceContent = resolve(
    ExperienceService,
    null
  ) as ExperienceService | null;
  protected observe: ObserveController<
    LitElement & ContentComponentProperties<K, T>
  >;
  protected optionsService = resolve(FeatureOptionsService, null);
  protected tokenResolver = resolve(TokenResolver);

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

  protected dynamicVisibilityRules(): Observable<ComponentVisibility | null> {
    return this.observe.get('uid').pipe(
      switchMap((uid) =>
        uid && this.experienceContent
          ? this.experienceContent.getVisibilityState({ uid })
          : of(null)
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  protected isHidden(): Observable<boolean> {
    return this.dynamicVisibilityRules().pipe(
      distinctUntilChanged(),
      switchMap((config) =>
        config?.hide
          ? of(true)
          : config?.token
          ? this.tokenResolver
              .resolveToken(config.token)
              .pipe(map((value) => !!value))
          : of(false)
      )
    );
  }

  dynamicVisibilityState(): Observable<DynamicVisibilityStates> {
    return this.dynamicVisibilityRules().pipe(
      startWith(null),
      combineLatestWith(this.isHidden().pipe(startWith(null))),
      switchMap(([rules, visibility]) =>
        !rules
          ? of(DynamicVisibilityStates.None)
          : visibility === null
          ? of(DynamicVisibilityStates.Defer)
          : of(
              visibility
                ? DynamicVisibilityStates.Hidden
                : DynamicVisibilityStates.Visible
            )
      )
    );
  }
}
