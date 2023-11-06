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

  get<T>(
    key: string,
    overrideContext$: Observable<T | undefined> = EMPTY
  ): Observable<T | undefined> {
    return combineLatest([
      overrideContext$.pipe(startWith(undefined)),
      this.triggerContext$.pipe(
        startWith(undefined),
        switchMap(
          (): Observable<T | undefined> =>
            this.context?.get(this.host, key) ?? of(undefined)
        )
      ),
    ]).pipe(
      skip(1),
      tap(([overrideContext, context]) => {
        if (overrideContext) {
          this.context?.provide(this.host, key, overrideContext);
        }
      }),
      map(([overrideContext, context]) => overrideContext ?? context),
      distinctUntilChanged()
    );
  }

  provide(key: string, value: unknown): void {
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
