import { LitElement, ReactiveController } from 'lit';
import { ContentComponentProperties } from '../src/models';
import { resolve } from '@spryker-oryx/di';
import { Component, ExperienceService, LayoutService } from '../src/services';
import { Observable, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { TokenResolver } from '@spryker-oryx/core';
import { ObserveController } from '@spryker-oryx/utilities';

export class CompositionComponentsController implements ReactiveController {
  hostConnected?(): void;

  protected observe: ObserveController<LitElement & ContentComponentProperties>;
  protected tokenResolver = resolve(TokenResolver);
  protected experienceService = resolve(ExperienceService);
  protected layoutService = resolve(LayoutService);

  constructor(protected host: LitElement & ContentComponentProperties) {
    this.observe = new ObserveController(host);
    this.layoutService.getBreakpoint().subscribe(console.log)
  }

  protected components(): Observable<Component[] | null> {
    return this.observe
      .get('uid')
      .pipe(
        switchMap((uid) =>
          uid
            ? this.experienceService
                .getComponent({ uid })
                .pipe(map((component) => component.components ?? null))
            : of(null)
        )
      );
  }

  protected filterHiddenComponents(
    components: Component[]
  ): Observable<Component[]> {
    return combineLatest(
      components.map((component) => {
        const visibility = component.options?.visibility;

        if (!visibility) {
          return of(component);
        }

        if (visibility.hide) {
          return of(null);
        }

        if (visibility.hideByRule) {
          return this.tokenResolver.resolveToken(visibility.hideByRule).pipe(
            //hidden by default
            startWith(true),
            map((value) => (value ? null : component))
          );
        }

        return of(component);
      })
    ).pipe(map((components) => components.filter(Boolean) as Component[]));
  }

  getComponents(): Observable<Component[] | null> {
    return this.components().pipe(
      switchMap((components) =>
        components ? this.filterHiddenComponents(components) : of([])
      )
    );
  }

  hasDynamicallyVisibleChild(): Observable<boolean> {
    return this.components().pipe(
      map(
        (components) =>
          !!components?.some((component) => !!component.options?.visibility)
      )
    );
  }
}
