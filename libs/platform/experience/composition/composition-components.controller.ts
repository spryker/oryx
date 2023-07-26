import { LitElement, ReactiveController } from 'lit';
import { ContentComponentProperties, StyleRuleSet } from '../src/models';
import { resolve } from '@spryker-oryx/di';
import { Component, ExperienceService, LayoutService } from '../src/services';
import { Observable, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { TokenResolver } from '@spryker-oryx/core';
import { ObserveController, Size } from '@spryker-oryx/utilities';

export class CompositionComponentsController implements ReactiveController {
  hostConnected?(): void;

  protected observe: ObserveController<LitElement & ContentComponentProperties>;
  protected tokenResolver = resolve(TokenResolver);
  protected experienceService = resolve(ExperienceService);
  protected layoutService = resolve(LayoutService);

  constructor(protected host: LitElement & ContentComponentProperties) {
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
                .pipe(map((component) => component.components ?? null))
            : of(null)
        )
      );
  }

  protected filterHiddenComponents(
    components: Component[],
    breakpoint?: Size
  ): Observable<Component[]> {
    return combineLatest(
      components.map((component) => {
        //short check for the SSR
        if (!breakpoint) {
          return this.hasVisibilityRules(component) ? of(null) : of(component);
        }

        const rules = this.getCurrentRules(component, breakpoint);

        if (!rules) {
          return of(component);
        }

        if (rules.hide) {
          return of(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.tokenResolver.resolveToken(rules.hideByRule!).pipe(
          //hidden by default
          startWith(true),
          map((value) => (value ? null : component))
        );
      })
    ).pipe(map((components) => components.filter(Boolean) as Component[]));
  }

  protected getCurrentRules(
    component: Component,
    breakpoint: Size
  ): StyleRuleSet | void {
    return component.options?.rules?.find(
      ({ query, hide, hideByRule }) =>
        (hide || hideByRule) &&
        (!query?.breakpoint || query.breakpoint === breakpoint)
    );
  }

  getComponents(): Observable<Component[] | null> {
    return combineLatest([
      this.components(),
      this.layoutService.getBreakpoint().pipe(startWith(undefined)),
    ]).pipe(
      switchMap(([components, breakpoint]) =>
        components
          ? this.filterHiddenComponents(components, breakpoint)
          : of([])
      )
    );
  }

  protected hasVisibilityRules(component: Component): boolean {
    return !!component.options?.rules?.some(
      ({ hide, hideByRule }) => !!(hide || hideByRule)
    );
  }

  hasDynamicallyVisibleChild(): Observable<boolean> {
    return this.components().pipe(
      map((components) => !!components?.some(this.hasVisibilityRules))
    );
  }
}
