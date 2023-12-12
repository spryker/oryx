import { TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ContentComponentProperties,
  ExperienceService,
  ScreenService,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import { ObserveController, Size } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { Observable, combineLatest, map, of, startWith, switchMap } from 'rxjs';

export class CompositionComponentsController implements ReactiveController {
  hostConnected?(): void;

  protected observe: ObserveController<LitElement & ContentComponentProperties>;
  protected tokenResolver = resolve(TokenResolver);
  protected experienceService = resolve(ExperienceService);
  protected screenService = resolve(ScreenService);

  constructor(protected host: LitElement & ContentComponentProperties) {
    this.observe = new ObserveController(host);
  }

  getComponents(): Observable<Component[] | null> {
    return combineLatest([
      this.components(),
      this.screenService.getScreenSize(),
    ]).pipe(
      switchMap(([components, breakpoint]) =>
        components
          ? this.filterHiddenComponents(components, breakpoint)
          : of([])
      )
    );
  }

  hasDynamicallyVisibleComponent(): Observable<boolean> {
    return this.components().pipe(
      map(
        (components) =>
          !!components?.some((component) => !!this.getRules(component))
      )
    );
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
    screenSize?: Size
  ): Observable<Component[]> {
    return combineLatest(
      components.map((component) => {
        const rules = this.getRules(component, screenSize);

        if (!rules) {
          return of(component);
        }

        if (rules.hide) {
          return of(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.tokenResolver
          .resolveToken(rules.hideByRule!, { contextElement: this.host })
          .pipe(
            //hidden by default
            startWith(true),
            map((value) => (value ? null : component))
          );
      })
    ).pipe(map((components) => components.filter(Boolean) as Component[]));
  }

  protected getRules(
    component: Component,
    screenSize?: Size
  ): StyleRuleSet | void {
    return component.options?.rules?.find(
      ({ query, hide, hideByRule }) =>
        (hide || hideByRule) &&
        (!screenSize || !query?.breakpoint || query.breakpoint === screenSize)
    );
  }
}
