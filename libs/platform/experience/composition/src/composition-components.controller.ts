import { LitElement, ReactiveController } from 'lit';
import { ContentComponentProperties } from '../../src/models';
import { resolve } from '@spryker-oryx/di';
import { Component, ExperienceService, Visibility } from '../../src/services';
import {
  Observable,
  combineLatest,
  combineLatestWith,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { TokenResolver } from '@spryker-oryx/core';
import { ObserveController } from '@spryker-oryx/utilities';

export class CompositionComponentsController implements ReactiveController {
  hostConnected?(): void;

  protected observe: ObserveController<LitElement & ContentComponentProperties>;
  protected tokenResolver = resolve(TokenResolver);
  protected experienceService = resolve(ExperienceService);

  constructor(protected host: LitElement & ContentComponentProperties) {
    this.host.addController(this);
    this.observe = new ObserveController(host);
  }

  protected components(): Observable<Component[] | null> {
    return this.observe
      .get('uid')
      .pipe(
        switchMap((uid) =>
          uid
            ? this.experienceService
                .getComponent({ uid })
                .pipe(map((component) => component?.components ?? null))
            : of(null)
        )
      );
  }

  protected componentsVisibility(): Observable<
    Observable<Visibility>[] | null
  > {
    return this.components().pipe(
      map((components) =>
        components
          ? components.map((c) => {
              const visibility = c.options?.data?.visibility;

              if (!visibility) {
                return of(Visibility.None);
              }

              if (visibility.hide) {
                return of(Visibility.Hidden);
              }

              if (visibility.hideByRule) {
                return this.tokenResolver
                  .resolveToken(visibility.hideByRule)
                  .pipe(
                    startWith(Visibility.Hidden),
                    map((value) =>
                      value ? Visibility.Hidden : Visibility.Visible
                    )
                  );
              }

              return of(Visibility.Visible);
            })
          : null
      )
    );
  }

  getComponents(): Observable<Component[] | null> {
    return this.components().pipe(
      combineLatestWith(this.componentsVisibility()),
      switchMap(([components, visibility]) =>
        visibility
          ? combineLatest(visibility).pipe(
              map(
                (v) =>
                  components?.filter((c, i) => !(v[i] === Visibility.Hidden)) ??
                  []
              )
            )
          : of(components)
      )
    );
  }

  hasDynamicallyVisibleSuccessor(): Observable<boolean> {
    return this.components().pipe(
      map(
        (components) => !!components?.some((c) => !!c.options?.data?.visibility)
      )
    );
  }
}
