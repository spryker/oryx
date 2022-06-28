import { isClient } from '@spryker-oryx/typescript-utils';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { BehaviorSubject, defer, distinctUntilChanged, Observable } from 'rxjs';

export class ObserveController<T extends ReactiveControllerHost>
  implements ReactiveController
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected observablesMap = new Map<keyof T, BehaviorSubject<any>>();

  constructor(protected host: T) {
    (this.host = host).addController(this);
  }

  get<K extends keyof T>(property: K): Observable<T[K]> {
    return defer(() => {
      if (!this.observablesMap.has(property)) {
        this.observablesMap.set(
          property,
          new BehaviorSubject(this.host[property])
        );
      }

      if (!isClient()) {
        this.observablesMap.get(property)?.next?.(this.host[property]);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.observablesMap.get(property)!;
    }).pipe(distinctUntilChanged());
  }

  hostUpdated(): void {
    for (const [key, subject$] of this.observablesMap.entries()) {
      if (this.host[key] !== subject$.getValue()) {
        subject$.next(this.host[key]);
      }
    }
  }
}
