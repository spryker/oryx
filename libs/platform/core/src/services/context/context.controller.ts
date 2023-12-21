import { resolve } from '@spryker-oryx/di';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  skip,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ContextService } from './context.service';

export class ContextController implements ReactiveController {
  protected context = resolve(ContextService, null);
  protected triggerContext$ = new BehaviorSubject<void | null>(null);

  constructor(protected host: ReactiveControllerHost & Element) {
    (this.host = host).addController(this);
  }

  get<T extends keyof ContextValue>(
    key: T,
    overrideContext$?: Observable<ContextValue[T] | undefined>
  ): Observable<ContextValue[T] | undefined>;
  get<T>(
    key: string,
    overrideContext$?: Observable<T | undefined>
  ): Observable<T | undefined>;
  get(
    key: string,
    overrideContext$: Observable<unknown | undefined> = EMPTY
  ): Observable<unknown | undefined> {
    return combineLatest([
      overrideContext$.pipe(startWith(undefined)),
      this.triggerContext$.pipe(
        startWith(undefined),
        switchMap(() => this.context?.get(this.host, key) ?? of(undefined))
      ),
    ]).pipe(
      skip(1),
      tap(([overrideContext]) => {
        if (overrideContext)
          this.context?.provide(this.host, key, overrideContext);
      }),
      map(([overrideContext, context]) => overrideContext ?? context),
      distinctUntilChanged()
    );
  }

  provide(key: string, value: unknown): void {
    if (this.context?.get(this.host, key) === value) return;
    if (value === undefined) {
      this.context?.remove(this.host, key);

      return;
    }

    this.context?.provide(this.host, key, value);
  }

  remove(key: string): void {
    this.context?.remove(this.host, key);
  }

  hostConnected(): void {
    this.triggerContext$.next();
  }
}
